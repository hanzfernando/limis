import express from 'express';
import { authToken } from '../middlewares/auth';
import { addVault, getVaultById, getVaults, updateVault } from '../controllers/vaultController';

const router = express.Router();

router.post('/', authToken, addVault);
router.get('/', authToken, getVaults)
router.get('/:id', authToken, getVaultById)
router.put('/:id', authToken, updateVault)

export default router;
