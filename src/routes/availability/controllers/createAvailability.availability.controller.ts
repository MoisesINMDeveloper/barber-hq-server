import { Request, Response } from 'express';
import availabilityPrisma from '../../../models/availability.prisma';
import moment from 'moment-timezone';

export const createAvailability = async (req: Request, res: Response) => {
    try {
        const { barberId, day, startTime, endTime } = req.body;

        if (!barberId || !day || !startTime || !endTime) {
            res.status(400).json({ message: 'Faltan datos obligatorios.' });
            return;
        }

        // Convertir las horas de inicio y fin a la zona horaria de Caracas
        const startMoment = moment.tz(startTime, 'HH:mm', 'America/Caracas');
        const endMoment = moment.tz(endTime, 'HH:mm', 'America/Caracas');

        // Convertir las horas a formato 'HH:mm' para almacenarlas correctamente
        const formattedStartTime = startMoment.format('HH:mm');
        const formattedEndTime = endMoment.format('HH:mm');

        // Verificar si ya existe disponibilidad para ese barbero en el mismo día y rango de horario
        const existingAvailability = await availabilityPrisma.findFirst({
            where: {
                barberId,
                day,
                OR: [
                    {
                        startTime: { lte: formattedEndTime },  // Compara con la hora final
                        endTime: { gte: formattedStartTime }   // Compara con la hora de inicio
                    }
                ]
            }
        });

        if (existingAvailability) {
            res.status(400).json({
                message: `El barbero ya tiene disponibilidad registrada para el ${day} en un horario similar.`
            });
            return;
        }

        // Crear la disponibilidad, las horas ya están en la zona horaria correcta
        const newAvailability = await availabilityPrisma.create({
            data: { barberId, day, startTime: formattedStartTime, endTime: formattedEndTime },
        });

        res.status(201).json({ message: 'Disponibilidad creada con éxito', data: newAvailability });
    } catch (error) {
        res.status(500).json({ message: `Error al crear la disponibilidad: ${error}` });
    }
};
