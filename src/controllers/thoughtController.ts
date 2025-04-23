import { User, Thought } from '../models/index.js';
import mongoose from 'mongoose';

// GET to get all thoughts
import { Request, Response } from 'express';

export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        return res.json(thoughts);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ message: errorMessage });
        return;
    }
};

// GET to get a single thought by its _id
export const getThoughtById = async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.thoughtId)) {
        return res.status(400).json({ message: 'Invalid thought ID' });
    }

    try {
        const thought = await Thought.findById(req.params.thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        return res.json(thought);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ message: errorMessage });
    }
};

// POST to create a new thought
export const createThought = async (req: Request, res: Response) => {
    const { userId, text } = req.body;

    if (!userId || !text) {
        return res.status(400).json({ message: 'User ID and text are required' });
    }

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const thought = await Thought.create(req.body);

        await User.findByIdAndUpdate(
            userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );

        return res.status(201).json(thought);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(400).json({ message: errorMessage });
    }
};

// PUT to update a thought by its _id
export const updateThought = async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.thoughtId)) {
        return res.status(400).json({ message: 'Invalid thought ID' });
    }

    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        return res.json(thought);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(400).json({ message: errorMessage });
    }
};

// DELETE to remove a thought by its _id
export const deleteThought = async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.thoughtId)) {
        return res.status(400).json({ message: 'Invalid thought ID' });
    }

    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        return res.json({ message: 'Thought deleted!' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ message: errorMessage });
    }
};

// POST to create a reaction stored in a single thought's reactions array field
export const addReaction = async (req: Request,res: Response) => {
    if (!mongoose.isValidObjectId(req.params.thoughtId)) {
        return res.status(400).json({ message: 'Invalid thought ID' });
    }

    if (!req.body || !req.body.reactionBody) {
        return res.status(400).json({ message: 'Reaction body is required' });
    }

    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        return res.json(thought);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(400).json({ message: errorMessage });
    }
};

// DELETE to pull and remove a reaction by the reaction's reactionId value
export const removeReaction = async (req: Request,res: Response) => {
    if (!mongoose.isValidObjectId(req.params.thoughtId)) {
        return res.status(400).json({ message: 'Invalid thought ID' });
    }

    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        return res.json(thought);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ message: errorMessage });
    }
};