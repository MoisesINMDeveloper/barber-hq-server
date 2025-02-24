import {Request, Response } from 'express';
import availabilityPrisma from '../../../models/availability.prisma';

export const readOneAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const availability = await availabilityPrisma.findUnique({
            where: { id: parseInt(id) },
            include: {
                barber: true
            }
        });

        if (!availability) {
         res.status(404).json({ message: 'Disponibilidad no encontrada.' });
            return
        }

        res.status(200).json({ data: availability });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la disponibilidad: ${error}` });
    }
}