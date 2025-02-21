import express from 'express';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { createHaircut } from './controllers/index'
const router = express.Router();

router.post('/create', authenticatedReq, createHaircut);

export default router;
