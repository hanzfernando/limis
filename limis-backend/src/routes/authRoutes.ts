import express from 'express';
import { 
  login,
  signup, 
  verifyEmail 
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login)
router.get('/verify-email', verifyEmail);

export default router;
