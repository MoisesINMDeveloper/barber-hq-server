import { Request, Response } from "express";
import { hashPassword } from "../../../services/auth.service";
import userPrisma from "../../../models/user.prisma";
import bankPrisma from "../../../models/bank.prisma";
import { sendCodeVerification } from "../../../services/email.service";
import { verifyCodeGenerate } from "../../../utils/verifyCodeGenerate";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone, nationalId, bankName, bankCode } = req.body;

  try {
    // Validar datos obligatorios
    if (!name || !email || !password || !phone || !nationalId) {
      res.status(400).json({ message: "Todos los campos obligatorios deben completarse." });
      return;
    }

    // Verificar si el usuario ya está registrado
    const existingUser = await userPrisma.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "El correo ingresado ya existe." });
      return;
    }

    // Generar código de verificación
    const verificationCode = verifyCodeGenerate();
    sendCodeVerification(email, verificationCode);

    const expiryDate = new Date();
    // Código válido por 1 hora
    expiryDate.setHours(expiryDate.getHours() + 1);

    const hashedPassword = await hashPassword(password);

    // Crear el usuario sin cuenta bancaria
    const newUser = await userPrisma.create({
      data: {
        name,
        email,
        phone,
        verificationCode,
        codeExpiry: expiryDate,
        nationalId,
        password: hashedPassword,
      },
    });

    let bankAccountData = null;

    // Crear cuenta bancaria solo si se proporcionan datos bancarios
    if (bankName && bankCode) {
      // Verificar si ya existe una cuenta bancaria con esos datos
      const existingBankAccount = await bankPrisma.findFirst({
        where: { bankName, bankCode },
      });

      if (existingBankAccount) {
        // Si existe, asociamos la cuenta bancaria al usuario
        bankAccountData = existingBankAccount;
      } else {
        // Si no existe, creamos una nueva cuenta bancaria
        bankAccountData = await bankPrisma.create({
          data: {
            bankName,
            bankCode,
            user: { connect: { id: newUser.id } }, // Asociamos la cuenta bancaria al usuario
          },
        });
      }
    }

    // Actualizamos la relación con la cuenta bancaria
    await userPrisma.update({
      where: { id: newUser.id },
      data: {
        bankAccountId: bankAccountData ? bankAccountData.id : null,
      },
    });

    // Respondemos con el usuario y los datos bancarios
    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        verified: newUser.verified,
        verificationCode: newUser.verificationCode,
        codeExpiry: newUser.codeExpiry,
        nationalId: newUser.nationalId,
        bankAccount: bankAccountData
          ? {
              id: bankAccountData.id,
              bankName: bankAccountData.bankName,
              bankCode: bankAccountData.bankCode,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Hubo un error en el registro." });
  }
};
