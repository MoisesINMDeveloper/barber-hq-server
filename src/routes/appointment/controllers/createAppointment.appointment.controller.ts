import { Request, Response } from 'express';
import moment from 'moment-timezone';  // Importar moment-timezone
import appointmentPrisma from '../../../models/appointment.prisma';
import userPrisma from '../../../models/user.prisma';
import haircutPrisma from '../../../models/haircut.prisma';
import availabilityPrisma from '../../../models/availability.prisma';

// Configurar moment para usar el idioma español
moment.locale('es');  // Establecer el idioma en español

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { clientName, phone, barberId, date, haircutId, paymentReference, paymentImage } = req.body;

        if (!clientName || !phone || !barberId || !date || !haircutId || !paymentReference || !paymentImage) {
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

        // Convertir la fecha de la cita de UTC a la zona horaria de Caracas usando moment-timezone
        const appointmentDate = moment(date).tz('America/Caracas', true); // Convertimos con zona horaria de Caracas

        // Ajustar el formato para la fecha y hora
        const appointmentDay = appointmentDate.format('dddd');  // Día en formato "lunes", "martes", etc.
        const appointmentHour = appointmentDate.format('HH:mm');  // Hora en formato 24 horas "HH:mm"

        // Verificar disponibilidad del barbero en esa fecha y hora
        const barberAvailability = await availabilityPrisma.findFirst({
            where: {
                barberId,
                day: appointmentDay.charAt(0).toUpperCase() + appointmentDay.slice(1), // Capitalizar el día
                startTime: { lte: appointmentHour }, // Asegurarse de que la hora de inicio sea antes o igual que la solicitada
                endTime: { gte: appointmentHour }    // Asegurarse de que la hora de finalización sea después o igual que la solicitada
            }
        });

        if (!barberAvailability) {
            res.status(400).json({
                message: `El barbero no está disponible el ${appointmentDay} a las ${appointmentHour}.`
            });
            return;
        }

        // Verificar si ya hay una cita en esa fecha y hora
        const appointmentExists = await appointmentPrisma.findFirst({
            where: { date: appointmentDate.toDate(), barberId }
        });

        if (appointmentExists) {
            res.status(400).json({
                message: `Ya existe una cita para el ${appointmentDay} a las ${appointmentHour} con este barbero.`
            });
            return;
        }

        // Crear la cita con los datos de pago
        const newAppointment = await appointmentPrisma.create({
            data: {
                clientName,
                phone,
                barberId,
                date: appointmentDate.toDate(),
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
