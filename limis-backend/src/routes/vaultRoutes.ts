import express from 'express';
import { authToken } from '../middlewares/auth';
import { addVault } from '../controllers/vaultController';

const router = express.Router();

router.post('/', authToken, addVault);

export default router;
