import { Request, Response } from 'express';
import appointmentPrisma from '../../../models/appointment.prisma';
export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { haircutId, barberId, date, time } = req.body;

        if (!id || !haircutId || !barberId || !date || !time) {
            res.status(400).json({ message: 'Faltan datos obligatorios.' });
            return;
        }

        const existingAppointment = await appointmentPrisma.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingAppointment) {
            res.status(404).json({ message: 'Cita no encontrada.' });
            return;
        }

        const updatedAppointment = await appointmentPrisma.update({
            where: { id: Number(id) },
            data: { haircutId, barberId, date: new Date(`${date}T${time}`) }
        });

        res.status(200).json({ message: 'Cita actualizada con éxito', data: updatedAppointment });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar la cita: ${error}` });
    }
}