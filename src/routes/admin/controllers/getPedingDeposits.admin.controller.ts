import { Request, Response } from 'express';
import { TRSCSTATUS } from '@prisma/client';
import depositsPrisma from '../../../models/deposits.prisma';

// Historial de depositos pendientes
export const getPedingDeposits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // *-----* //
    // Logica //
    // *---* //
    // Obtenemos todos los depositos pendientes
    const allDeposits = await depositsPrisma.findMany({
      where: {
        status: TRSCSTATUS.PEDING,
      },
      //   Los ordenamos desde el mas viejo al mas nuevo
      orderBy: {
        date: 'asc',
      },
    });

    // Convertir 'amount' de string a número
    const depositsWithNumericAmount = allDeposits.map((deposit) => ({
      ...deposit,
      amount: deposit.amount.toNumber(),
    }));

    res.status(200).json({ data: depositsWithNumericAmount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error en la petición.',
    });
  }
};
