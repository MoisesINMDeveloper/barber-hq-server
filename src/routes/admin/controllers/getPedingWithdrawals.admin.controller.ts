import { Request, Response } from 'express';
import { TRSCSTATUS } from '@prisma/client';
import withdrawalsPrisma from '../../../models/withdrawals.prisma';

// Historial de depositos pendientes
export const getPedingWithdrawals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // *-----* //
    // Logica //
    // *---* //
    // Obtenemos todos los depositos pendientes
    const allWithdrawals = await withdrawalsPrisma.findMany({
      where: {
        status: TRSCSTATUS.PEDING,
      },
      //   Los ordenamos desde el mas viejo al mas nuevo
      orderBy: {
        date: 'asc',
      },
    });

    // Convertir 'amount' de string a número
    const depositsWithNumericAmount = allWithdrawals.map((withdrawal) => ({
      ...withdrawal,
      amount: withdrawal.amount.toNumber(),
    }));

    res.status(200).json({ data: depositsWithNumericAmount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error en la petición.',
    });
  }
};
