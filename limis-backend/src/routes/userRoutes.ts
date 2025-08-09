import express from 'express'
import { authToken } from '../middlewares/auth';
import {
  changePassword,
  getProfile
} from '../controllers/userController'

const router = express.Router();

router.get('/profile', authToken, getProfile);
router.patch('/change-password', authToken, changePassword)

export default router;

