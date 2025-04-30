import { Router } from 'express';
const router = Router();
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} from '../../controllers/userController.js';

// /api/users
router.route('/')
  .get(getAllUsers) // GET all users
  .post(createUser); // POST a new user

// /api/users/:userId
router
  .route('/:userId')
  .get(getUserById) // GET a single user by its _id
  .put(updateUser) // PUT to update a user by its _id
  .delete(deleteUser); // DELETE to remove user by its _id

// /api/users/:userId/friends/:friendId
router
  .route('/:userId/friends/:friendId')
  .post(addFriend) // POST to add a new friend to a user's friend list
  .delete(removeFriend); // DELETE to remove a friend from a user's friend list

export { router as userRouter };
