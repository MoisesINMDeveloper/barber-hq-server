// src/controllers/bankAccount.controller.ts
import { Request, Response } from "express";
import bankPrisma from "../../../models/bank.prisma";
// Crear una cuenta bancaria
export const createBankAccount = async (req: Request, res: Response) => {
  try {
    const { bankName, bankCode, bankAccount, userId } = req.body;
    
    const bankAccountExists = await bankPrisma.findUnique({
      where: { userId },
    });
    
    if (bankAccountExists) {
      return res.status(400).json({ message: "El usuario ya tiene una cuenta bancaria." });
    }
    
    const newBankAccount = await bankPrisma.create({
      data: { bankName, bankCode, bankAccount, userId },
    });
    
    res.status(201).json(newBankAccount);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Obtener una cuenta bancaria por ID de usuario
export const getBankAccountByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bankAccount = await bankPrisma.findUnique({
      where: { userId },
    });
    
    if (!bankAccount) {
      return res.status(404).json({ message: "Cuenta bancaria no encontrada." });
    }
    
    res.status(200).json(bankAccount);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Actualizar una cuenta bancaria
export const updateBankAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { bankName, bankCode, bankAccount } = req.body;
    
    const updatedBankAccount = await bankPrisma.update({
      where: { userId },
      data: { bankName, bankCode, bankAccount },
    });
    
    res.status(200).json(updatedBankAccount);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Eliminar una cuenta bancaria
export const deleteBankAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await bankPrisma.delete({
      where: { userId },
    });
    
    res.status(200).json({ message: "Cuenta bancaria eliminada exitosamente." });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
