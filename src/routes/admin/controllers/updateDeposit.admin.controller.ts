import { Request, Response } from 'express';
import usersPrisma from '../../../models/user.prisma';
import { TRSCSTATUS } from '@prisma/client';
import depositsPrisma from '../../../models/deposits.prisma';

// Cambiar usuario, nombre y apellido.
export const updateDeposit = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, status } = req.body;

  try {
    // *---------------* //
    // Pre-validaciones //
    // *-------------* /
    if (!id || !status) {
      res.status(400).json({
        message: 'El ID y el nuevo estado del deposito son necesarios.',
      });
      return;
    }

    const deposit = await depositsPrisma.findUnique({
      where: {
        id,
      },
    });

    if (!deposit) {
      res.status(400).json({
        message: 'El deposito que intentas actualizar no es valido.',
      });
      return;
    }

    if (deposit.status !== TRSCSTATUS.PEDING) {
      res.status(400).json({
        message: 'El deposito que intentas actualizar no es valido.',
      });
      return;
    }

    // *-----* //
    // Logica //
    // *---* //

    if (status === TRSCSTATUS.CONFIRMED) {
      // Deposito confirmado
      // Actualizamos el estado del deposito
      await depositsPrisma.update({
        where: {
          id,
        },
        data: {
          status: TRSCSTATUS.CONFIRMED,
        },
      });

      // Actualizamos el saldo del usuario
      const user = await usersPrisma.findUnique({
        where: {
          id: deposit.userId,
        },
      });
      await usersPrisma.update({
        where: {
          id: deposit.userId,
        },
        data: {
          saldo: user?.saldo?.plus(deposit.amount),
        },
      });
      res.status(200).json({
        message: 'Has confirmado el deposito correctamente.',
      });
    } else {
      // Deposito rechazado
      await depositsPrisma.update({
        where: {
          id,
        },
        data: {
          status: TRSCSTATUS.CANCELED,
        },
      });

      res.status(200).json({
        message: 'Has cancelado el deposito correctamente.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error en la petición.',
    });
  }
};
