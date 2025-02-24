import { Request, Response } from 'express';
import availabilityPrisma from '../../../models/availability.prisma';
import moment from 'moment-timezone';

export const createAvailability = async (req: Request, res: Response) => {
    try {
        let { barberId, day, startTime, endTime } = req.body;

        if (!barberId || !day || !startTime || !endTime) {
            res.status(400).json({ message: 'Faltan datos obligatorios.' });
            return
        }

        // Capitalizar el día correctamente
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

        // Validar que el formato de startTime y endTime sea correcto
        const isValidStartTime = moment(startTime, 'HH:mm:ss', true).isValid();
        const isValidEndTime = moment(endTime, 'HH:mm:ss', true).isValid();

        if (!isValidStartTime || !isValidEndTime) {
            res.status(400).json({ message: 'Formato de hora inválido. Use HH:mm:ss.' });
            return;        
        }

        // Verificar que startTime sea menor que endTime
        if (moment(startTime, 'HH:mm:ss').isSameOrAfter(moment(endTime, 'HH:mm:ss'))) {
            res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
            return;
        }

        // Verificar si ya existe disponibilidad en ese horario
        const existingAvailability = await availabilityPrisma.findFirst({
            where: {
                barberId,
                day,
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
                message: `El barbero ya tiene disponibilidad registrada para el ${day} en un horario similar.`
            
            });
        }

        // Crear disponibilidad
        const newAvailability = await availabilityPrisma.create({
            data: { barberId, day, startTime, endTime },
        });

        res.status(201).json({ message: 'Disponibilidad creada con éxito', data: newAvailability });
    } catch (error) {
        res.status(500).json({ message: `Error al crear la disponibilidad: ${error}` });
    }
};
