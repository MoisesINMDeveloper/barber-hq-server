import express from 'express';
import { authenticatedReq } from '../../middlewares/auth.handler';
import { createAvailability, deleteAvailability, readAllAvailability, readOneAvailability, updateAvailability } from './controllers'
const router = express.Router();

router.post('/create', authenticatedReq, createAvailability);
router.get('/getAll', authenticatedReq, readAllAvailability);
router.get('/getOne/:id', authenticatedReq, readOneAvailability);
router.put('/update/:id', authenticatedReq, updateAvailability);
router.delete('/delete/:id', authenticatedReq, deleteAvailability);
export default router;
