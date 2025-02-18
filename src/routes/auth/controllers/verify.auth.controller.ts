import { Request, Response } from 'express';
import userPrisma from '../../../models/user.prisma';
import {
  generateRefresh,
  generateToken,
  setVerificationCode,
} from '../../../services/auth.service';
import { verifyCodeGenerate } from '../../../utils/verifyCodeGenerate';
import { sendCodeVerification } from '../../../services/email.service';
import { cifrarBase64 } from '../../../utils/cifrarBase64';

const CRYPTO_KEY = process.env.CRYPTO_KEY || 'default';

// Verificación de usuario
export const verify = async (req: Request, res: Response): Promise<void> => {
  const { email, verificationCode } = req.body;

  try {
    // *---------------* //
    // Pre validaciones //
    // *-------------* //
    if (!email || !verificationCode) {
      res.status(400).json({
        message: 'Correo y codigo de verificación son necesarios',
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
    const currentTime = new Date();

    if (!expiryTime) {
      res.status(403).json({
        message: 'El usuario no tiene codigo de expiración.',
      });
      return;
    }

    // Si el código esta vencido, mandamos uno nuevo al correo directamente.
    if (currentTime > expiryTime) {
      const newCode = verifyCodeGenerate();

      // Enviamos el corre
      if (user?.email) {
        sendCodeVerification(user.email, newCode);
      } else {
        res.status(400).json({
          message: 'El correo del usuario no está disponible.',
        });
        return;
      }

      // Seteamos el nuevo codigo en la DB
      setVerificationCode(user?.id, newCode);

      // rta
      res.status(400).json({
        message:
          'El código de verificación enviado esta vencido, te hemos enviado uno nuevo a tu correo.',
      });
    } else {
      const saveCode = user?.verificationCode;

      if (saveCode === verificationCode) {
        const token = generateToken(user);
        const refresh = generateRefresh(user);

        // Si todo esta OK, cambiamos los siguientes parametros del usuario y devolvemos
        await userPrisma.update({
          where: { id: user.id },
          data: {
            verified: true,
            verificationCode: null,
            codeExpiry: null,
          },
        });

        const { password, id, ...userInfo } = user;

        const encryptedRole = cifrarBase64(user.role, CRYPTO_KEY);

        res.status(200).json({
          message: 'Tu cuenta ha sido verificada correctamente.',
          data: {
            ...userInfo,
            verified: true,
            token,
            refresh,
            role: encryptedRole,
          },
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
      message: 'Hubo un error la verifiación.',
    });
  }
};
