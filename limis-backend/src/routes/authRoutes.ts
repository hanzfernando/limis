import express from 'express';
import { authToken } from '../middlewares/auth';
import { 
  login,
  logout,
  signup, 
  verifyEmail 
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login)
router.post('/logout', authToken, logout)
router.get('/verify-email', verifyEmail);

export default router;
