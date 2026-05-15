import express from 'express';
import { authToken } from '../middlewares/auth';
import { addVault, deleteVaultById, getVaultById, getVaults, updateVault, updateVaultDetails } from '../controllers/vaultController';

const router = express.Router();

router.post('/', authToken, addVault);
router.get('/', authToken, getVaults)
router.get('/:id', authToken, getVaultById)
router.patch('/:id/details', authToken, updateVaultDetails)
router.put('/:id', authToken, updateVault)
router.delete('/:id', authToken, deleteVaultById)

export default router;
