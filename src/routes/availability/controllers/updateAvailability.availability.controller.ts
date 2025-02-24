import { Request, Response } from "express";
import availabilityPrisma from "../../../models/availability.prisma";
import moment from "moment";
export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { barberId, day, startTime, endTime } = req.body;

        if (!id || !barberId || !day || !startTime || !endTime) {
            res.status(400).json({ message: 'Faltan datos obligatorios.' });
            return;
        }

        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(); // Capitalizar día

        if (!moment(startTime, 'HH:mm:ss', true).isValid() || !moment(endTime, 'HH:mm:ss', true).isValid()) {
            res.status(400).json({ message: 'Formato de hora inválido. Use HH:mm:ss.' });
            return;
        }

        if (moment(startTime, 'HH:mm:ss').isSameOrAfter(moment(endTime, 'HH:mm:ss'))) {
            res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
            return;
        }

        // Verificar si ya existe otra disponibilidad en ese horario
        const existingAvailability = await availabilityPrisma.findFirst({
            where: {
                barberId,
                day,
                id: { not: Number(id) }, // Excluir el mismo registro al verificar
                OR: [
                    {
                        startTime: { lte: endTime },
                        endTime: { gte: startTime }
                    }
                ]
            }
        });

        if (existingAvailability) {
            res.status(400).json({
                message: `El barbero ya tiene otra disponibilidad en el ${day} en un horario similar.`
            
            });
            return
        }

        const updatedAvailability = await availabilityPrisma.update({
            where: { id: Number(id) },
            data: { barberId, day, startTime, endTime },
        });

        res.status(200).json({ message: 'Disponibilidad actualizada con éxito', data: updatedAvailability });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar disponibilidad: ${error}` });
    }
};