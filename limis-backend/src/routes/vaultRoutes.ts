import express from 'express';
import { authToken } from '../middlewares/auth';
import { addVault, getVaults } from '../controllers/vaultController';

const router = express.Router();

router.post('/', authToken, addVault);
router.get('/', authToken, getVaults)

export default router;
