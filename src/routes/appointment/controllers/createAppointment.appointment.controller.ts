import { Request, Response } from 'express';
import moment from 'moment-timezone';
import appointmentPrisma from '../../../models/appointment.prisma';
import userPrisma from '../../../models/user.prisma';
import haircutPrisma from '../../../models/haircut.prisma';
import availabilityPrisma from '../../../models/availability.prisma';

// Configurar moment en español
moment.locale('es');

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { clientName, phone, barberId, date, time, haircutId, paymentReference, paymentImage } = req.body;

        if (!clientName || !phone || !barberId || !date || !time || !haircutId || !paymentReference || !paymentImage) {
            res.status(400).json({ message: 'Todos los campos son requeridos.' });
            return;
        }

        const barberExists = await userPrisma.findUnique({ where: { id: barberId } });
        if (!barberExists) {
            res.status(404).json({ message: 'Barbero no encontrado.' });
            return;
        }

        const haircutExists = await haircutPrisma.findUnique({ where: { id: haircutId } });
        if (!haircutExists) {
            res.status(404).json({ message: 'Corte de cabello no encontrado.' });
            return;
        }

        // Concatenar `date` y `time` para formar una fecha completa
        const appointmentDateTime = moment.tz(`${date}T${time}`, 'America/Caracas').toISOString();

        // Extraer día y hora para la validación
        const appointmentDay = moment.tz(appointmentDateTime, 'America/Caracas').format('dddd');
        const appointmentHour = moment.tz(appointmentDateTime, 'America/Caracas').format('HH:mm:ss');

        // Capitalizar el día
        const formattedDay = appointmentDay.charAt(0).toUpperCase() + appointmentDay.slice(1);

        // Verificar disponibilidad del barbero en esa fecha y hora
        const barberAvailability = await availabilityPrisma.findFirst({
            where: {
                barberId,
                day: formattedDay,
                startTime: { lte: appointmentDateTime },
                endTime: { gte: appointmentDateTime }
            }
        });

        if (!barberAvailability) {
            res.status(400).json({
                message: `El barbero no está disponible el ${formattedDay} a las ${appointmentHour}.`
            });
            return;
        }

        // Verificar si ya hay una cita en esa fecha y hora
        const appointmentExists = await appointmentPrisma.findFirst({
            where: { date: appointmentDateTime, barberId }
        });

        if (appointmentExists) {
            res.status(400).json({
                message: `Ya existe una cita para el ${formattedDay} a las ${appointmentHour} con este barbero.`
            });
            return;
        }

        // Crear la cita
        const newAppointment = await appointmentPrisma.create({
            data: {
                clientName,
                phone,
                barberId,
                date: appointmentDateTime,
                haircutId,
                paymentReference,
                paymentImage
            }
        });

        res.status(201).json({ message: 'Cita creada exitosamente.', data: newAppointment });
    } catch (error) {
        res.status(500).json({ message: `Error al crear la cita: ${error}` });
    }
};
