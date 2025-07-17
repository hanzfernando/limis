import express from 'express'
import { authToken } from '../middlewares/auth';
import {
  getProfile
} from '../controllers/userController'

const router = express.Router();

router.get('/profile', authToken, getProfile);

export default router;

