import bcrypt from 'bcrypt';
// import { User } from '../types/user.interface';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import userModel from '../models/user.prisma';
import { cifrarBase64 } from '../utils/cifrarBase64';

const SAL_ROUNDS: number = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'default';
const CRYPTO_KEY = process.env.CRYPTO_KEY || 'default';

// Hashear password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SAL_ROUNDS);
};

// Comparar passwords
export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Generación de auth token
export const generateToken = (user: User): string => {
  const { id, email, role } = user;

  const encryptedRole = cifrarBase64(role, CRYPTO_KEY);

  return jwt.sign(
    {
      id,
      email,
      role: encryptedRole,
    },
    JWT_SECRET,
    { expiresIn: '2d' }
  );
};

// Generacion de refresh token
export const generateRefresh = (user: Omit<User, 'password'>): string => {
  const { id, email, role } = user;

  const encryptedRole = cifrarBase64(role, CRYPTO_KEY);

  return jwt.sign(
    {
      id,
      email,
      role: encryptedRole,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Usar en el reenvio del codigo, login y el usuario no este verificado, olvide mi contraseña
// Actualiza el codigo de verificación y la expiración
export const setVerificationCode = async (userId: number, code: string) => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // Código válido por 1 hora

  await userModel.update({
    where: { id: userId.toString() },
    data: {
      verificationCode: code,
      codeExpiry: expiryDate,
    },
  });
};
