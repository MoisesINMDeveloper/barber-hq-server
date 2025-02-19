import express from 'express';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { isAdmin } from './middlewares/admin.handler';
import {
  getPedingDeposits,
  getPedingWithdrawals,
  updateDeposit,
  updateWithdrawal,
} from './controllers/index';

const router = express.Router();

router.get('/getPedingDeposits', authenticatedReq, isAdmin, getPedingDeposits);
router.put('/updateDeposit', authenticatedReq, isAdmin, updateDeposit);
router.get(
  '/getPedingWithdrawals',
  authenticatedReq,
  isAdmin,
  getPedingWithdrawals
);
router.put('/updateWithdrawal', authenticatedReq, isAdmin, updateWithdrawal);

export default router;
