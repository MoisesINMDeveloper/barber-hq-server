import { Request, Response } from 'express';
import prisma from '../../../models/user.prisma';
import {
  comparePasswords,
  generateRefresh,
  generateToken,
  setVerificationCode,
} from '../../../services/auth.service';
import { verifyCodeGenerate } from '../../../utils/verifyCodeGenerate';
import { sendCodeVerification } from '../../../services/email.service';
import { cifrarBase64 } from '../../../utils/cifrarBase64';

const CRYPTO_KEY = process.env.CRYPTO_KEY || 'default';

// Inicio de sesión del usuario
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // *---------------* //
    // Pre validaciones //
    // *-------------* //
    if (!email) {
      res.status(400).json({ message: 'El email es obligatorio' });
      return;
    }
    if (!password) {
      res.status(400).json({ message: 'El password es obligatorio' });
      return;
    }

    // *------* //
    // Logica  //
    // *----* //

    const user = await prisma.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'Usuario y contraseñas no coinciden' });
      return;
    }

    if (!user.password) {
      res.status(404).json({ message: 'Usuario y contraseñas no coinciden' });
      return;
    }
    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      res.status(404).json({ message: 'Usuario y contraseñas no coinciden' });
      return;
    }

    // Si coinciden, validamos si esta verificado o no
    if (user?.verified) {
      const {
        id,
        password,
        verificationCode,
        codeExpiry,
        createdAt,
        ...userInfo
      } = user;
      const token = generateToken(user);
      const refresh = generateRefresh(user);


      const encryptedRole = cifrarBase64(user.role, CRYPTO_KEY);

      res.status(200).json({
        data: {
          ...userInfo,
          token,
          refresh,
          role: encryptedRole,
        },
      });
    } else {
      const newCode = verifyCodeGenerate();

      // Enviamos el codigo
      sendCodeVerification(user?.email as string, newCode);

      // Seteamos el codigo de vericación en la DB
      setVerificationCode(user?.id, newCode);

      res.status(401).json({
        message: 'Usuario no verificado.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Hubo un error en el inicio de sesión, intentalo mas',
    });
  }
};
