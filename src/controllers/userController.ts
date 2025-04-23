import { User, Thought } from '../models/index.js';

// GET all users
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET a single user by its _id and populated thought and friend data
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('thoughts')
            .populate('friends');

        if (!user) {
            return res.status(404).json({ message: 'No user found with this ID' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST a new user
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT to update a user by its _id
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user found with this ID' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE to remove user by its _id
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'No user found with this ID' });
        }

        // Remove associated thoughts
        await Thought.deleteMany({ _id: { $in: user.thoughts } });

        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST to add a new friend to a user's friend list
export const addFriend = async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $addToSet: { friends: req.params.friendId } }, // Add friendId to the friends array if it doesn't already exist
          { new: true, runValidators: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
      }

      res.json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// DELETE to remove a friend from a user's friend list
export const removeFriend = async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $pull: { friends: req.params.friendId } }, // Remove friendId from the friends array
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
      }

      res.json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};