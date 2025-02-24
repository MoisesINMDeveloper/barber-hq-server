import { Request, Response } from "express";
import availabilityPrisma from '../../../models/availability.prisma';
export const readAllAvailability = async (req: Request, res: Response) => {
    try {
        const availability = await availabilityPrisma.findMany({
            include: {
                barber: true
            }
        });
        res.status(200).json({ data: availability });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la disponibilidad: ${error}` });
    }
}