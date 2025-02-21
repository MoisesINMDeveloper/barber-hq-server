import express from 'express';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { createAppointment } from './controllers';

const router = express.Router();

router.post('/create', authenticatedReq, createAppointment);

export default router;
