import { Request, Response } from 'express';
import userPrisma from '../../../models/user.prisma';
import {
  hashPassword,
  setVerificationCode,
} from '../../../services/auth.service';
import { verifyCodeGenerate } from '../../../utils/verifyCodeGenerate';
import { sendCodeForgotPassword } from '../../../services/email.service';

// Verificación de usuario
export const recoveryPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, verificationCode, password } = req.body;

  try {
    // *---------------* //
    // Pre validaciones //
    // *-------------* //
    if (!email || !verificationCode || !password) {
      res.status(400).json({
        message: 'Correo, contraseña y codigo de verificación son necesarios',
      });
      return;
    }

    // *---------------------* //
    // Logica de verificacion //
    // *-------------------* //
    const user = await userPrisma.findUnique({
      where: { email },
    });

    // Si no existe el usuario, responde con error.
    if (!user) {
      res.status(404).json({
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Validamos si el codigo esta expirado o no.
    const expiryTime = user?.codeExpiry;
    const now = new Date();

    if (!expiryTime) {
      res.status(403).json({
        message: 'El usuario no tiene codigo de expiración.',
      });
      return;
    }

    // Si el código esta vencido, mandamos uno nuevo al correo directamente.
    if (now > expiryTime) {
      const newCode = verifyCodeGenerate();

      if (user?.email) {
        sendCodeForgotPassword(user.email, newCode);
      } else {
        res.status(400).json({
          message: 'El usuario no tiene un correo electrónico válido.',
        });
        return;
      }

      setVerificationCode(user?.id, newCode);

      res.status(400).json({
        message:
          'El código de verificación enviado esta vencido, hemos enviado uno nuevo a tu correo.',
      });
    } else {
      const saveCode = user?.verificationCode;

      if (saveCode === verificationCode) {
        const newPassword = await hashPassword(password);

        // Si todo esta OK, cambiamos los siguientes parametros del usuario y devolvemos
        await userPrisma.update({
          where: { email: user?.email as string },
          data: {
            password: newPassword,
            codeExpiry: null,
            verificationCode: null,
          },
        });

        res.status(200).json({
          message: 'Tu contraseña ha sido actualizada correctamente.',
        });
      } else {
        res.status(400).json({
          message:
            'El código introducido es incorrecto, verifica y vuelve a intentarlo.',
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error, intentalo mas tarde.',
    });
  }
};
