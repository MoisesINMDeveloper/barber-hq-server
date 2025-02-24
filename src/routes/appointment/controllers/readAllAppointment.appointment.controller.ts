import { Request, Response } from "express";
import appointmentPrisma from "../../../models/appointment.prisma";
export const getAllAppointments  = async (req:Request, res:Response) => {
    try {
        const appoitments = await appointmentPrisma.findMany({
            include: {
                haircut: true,
                barber: true
            }
        });
        res.status(200).json({ data: appoitments });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener las citas: ${error}` });
    }
}