import { Request, Response } from 'express';
import usersPrisma from '../../../models/user.prisma';
import { TRSCSTATUS } from '@prisma/client';
import withdrawalsPrisma from '../../../models/withdrawals.prisma';

// Cambiar usuario, nombre y apellido.
export const updateWithdrawal = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, status, ref } = req.body;

  try {
    // *---------------* //
    // Pre-validaciones //
    // *-------------* /
    if (!id || !status) {
      res.status(400).json({
        message: 'El ID y el nuevo estado del retiro son necesarios.',
      });
      return;
    }

    const withdrawal = await withdrawalsPrisma.findUnique({
      where: {
        id,
      },
    });

    if (!withdrawal) {
      res.status(400).json({
        message: 'El retiro que intentas actualizar no es valido.',
      });
      return;
    }

    if (withdrawal.status !== TRSCSTATUS.PEDING) {
      res.status(400).json({
        message: 'El retiro que intentas actualizar no es valido.',
      });
      return;
    }

    // *-----* //
    // Logica //
    // *---* //

    if (status === TRSCSTATUS.CONFIRMED) {
      if (!ref) {
        res.status(400).json({
          message:
            'Para confirmar el retiro tienes que enviar el numero de referencia.',
        });
        return;
      }

      // Retiro confirmado
      // Actualizamos el estado del retiro
      await withdrawalsPrisma.update({
        where: {
          id,
        },
        data: {
          status: TRSCSTATUS.CONFIRMED,
          ref: ref,
        },
      });

      // Actualizamos el saldo del usuario
      const user = await usersPrisma.findUnique({
        where: {
          id: withdrawal.userId,
        },
      });
      await usersPrisma.update({
        where: {
          id: withdrawal.userId,
        },
        data: {
          saldo: user?.saldo?.sub(withdrawal.amount),
        },
      });
      res.status(200).json({
        message: 'Has confirmado el retiro correctamente.',
      });
    } else {
      // Deposito rechazado
      await withdrawalsPrisma.update({
        where: {
          id,
        },
        data: {
          status: TRSCSTATUS.CANCELED,
        },
      });

      res.status(200).json({
        message: 'Has cancelado el retiro correctamente.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error en la petición.',
    });
  }
};
