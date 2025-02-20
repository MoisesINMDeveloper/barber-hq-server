import express from 'express';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { createBarberShop } from './controllers';

const router = express.Router();

router.post('/create', authenticatedReq, createBarberShop);

export default router;
