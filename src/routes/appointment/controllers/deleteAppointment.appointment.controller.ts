import { Request, Response } from 'express';
import appointmentPrisma from '../../../models/appointment.prisma';
export const deleteAppointment = async (req:Request, res:Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'ID de cita requerido.' });
            return;
        }

        const existingAppointment = await appointmentPrisma.findUnique({
            where: { id: Number(id) }
        });

        if (!existingAppointment) {
            res.status(404).json({ message: 'Cita no encontrada.' });
            return;
        }

        await appointmentPrisma.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ message: 'Cita eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar la cita: ${error}` });
    }
}