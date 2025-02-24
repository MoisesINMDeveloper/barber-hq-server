import express from 'express';
import { createAppointment, deleteAppointment, getAllAppointments, readOneAppointment, updateAppointment,  } from './controllers';

const router = express.Router();

router.post('/create', createAppointment);
router.get('/getAll', getAllAppointments);
router.get('/getOne/:id', readOneAppointment);
router.put('/update/:id', updateAppointment);
router.delete('/delete/:id', deleteAppointment);

export default router;
