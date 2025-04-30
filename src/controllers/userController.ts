import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

// GET all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching users.' });
    }
};

// GET a single user by its _id and populated thought and friend data
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('thoughts')
            .populate('friends');

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching the user.' });
    }
};

// POST a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body); // Log the request body
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'An error occurred while creating the user.' });
    }
};

// PUT to update a user by its _id
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }

        res.json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'An error occurred while updating the user.' });
    }
};

// DELETE to remove user by its _id
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }

        // Remove associated thoughts
        await Thought.deleteMany({ _id: { $in: user.thoughts } });

        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'An error occurred while deleting the user.' });
    }
};

// POST to add a new friend to a user's friend list
export const addFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } }, // Add friendId to the friends array if it doesn't already exist
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'An error occurred while adding the friend.' });
    }
};

// DELETE to remove a friend from a user's friend list
export const removeFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } }, // Remove friendId from the friends array
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID' });
            return;
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'An error occurred while removing the friend.' });
    }
};