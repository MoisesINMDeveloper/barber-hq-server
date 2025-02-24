import {Request, Response} from "express";
import availabilityPrisma from '../../../models/availability.prisma';
export const deleteAvailability = async (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const availability = await availabilityPrisma.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Disponibilidad eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar la disponibilidad: ${error}` });
    }
}