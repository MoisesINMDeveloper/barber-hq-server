import { Request, Response } from 'express';
import userPrisma from '../../../models/user.prisma';
import { verifyCodeGenerate } from '../../../utils/verifyCodeGenerate';
import { sendCodeForgotPassword } from '../../../services/email.service';

// Olvide mi contraseña
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    // *---------------* //
    // Pre validaciones //
    // *-------------* //
    if (!email) {
      res.status(400).json({
        message: 'Correo electronico necesario.',
      });
      return;
    }

    // *-----* //
    // Logica //
    // *---* //
    const findUser = await userPrisma.findUnique({
      where: { email },
    });

    if (!findUser) {
      res.status(404).json({
        message: 'Correo electronico no encontrado.',
      });
      return;
    }

    // Generamos un nuevo codigo y una fecha de expiración.
    const newCode = verifyCodeGenerate();
    sendCodeForgotPassword(email, newCode);

    const expiryDate = new Date();
    // Codigo valido por 1 hora.
    expiryDate.setHours(expiryDate.getHours() + 1);

    await userPrisma.update({
      where: { email },
      data: {
        verificationCode: newCode,
        codeExpiry: expiryDate,
      },
    });

    res.status(200).json({
      message: 'Hemos enviado un codigo de verificación a tu correo.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error, por favor intenta mas tarde.',
    });
  }
};
