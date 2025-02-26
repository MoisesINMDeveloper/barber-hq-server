import { Request, Response } from 'express';
import userPrisma from '../../../models/user.prisma';

export const creeateWithdrawalRequest = async (req: Request, res: Response) => {
    try {
        const {barberId, amount} = req.body;
        
        if (!barberId || !amount) {
            res.status(400).json({ message: 'Datos invalidos.' });
            return
        }
        const barber = await userPrisma.findUnique({
            where: {
                id: barberId,
                role: "BARBER"
            }
        })
        if (!barber) {
            res.status(400).json({ message: 'Barbero no encontrado.' });
            return
        }
        if (barber.balance < amount) {
            res.status(400).json({ message: 'No tiene suficiente saldo.' });
            return
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}