import { Request, Response } from 'express';
import appointmentPrisma from '../../../models/appointment.prisma';
export const readOneAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'ID de cita requerido.' });
            return;
        }

        const appointment = await appointmentPrisma.findUnique({
            where: { id: Number(id) },
            include: {
                haircut: true,
                barber: true
            }
        });

        if (!appointment) {
            res.status(404).json({ message: 'Cita no encontrada.' });
            return;
        }

        res.status(200).json({ data: appointment });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la cita: ${error}` });
    }
}