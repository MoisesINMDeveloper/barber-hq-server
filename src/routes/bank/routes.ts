import express from 'express';
import { bankAccount, deleteBank, listBank, readBank, updateBank } from './controllers';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { isAdmin } from '../admin/middlewares/admin.handler';

const router = express.Router();

router.post('/create', authenticatedReq, isAdmin, bankAccount);
router.get('/list', authenticatedReq, listBank);
router.get('/get/:id', authenticatedReq, readBank);
router.put('/update/:id', authenticatedReq, isAdmin, updateBank);
router.delete('/delete/:id', authenticatedReq, isAdmin, deleteBank);

export default router;
