import express from 'express';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { createAvailability } from './controllers'
const router = express.Router();

router.post('/create', authenticatedReq, createAvailability);

export default router;
