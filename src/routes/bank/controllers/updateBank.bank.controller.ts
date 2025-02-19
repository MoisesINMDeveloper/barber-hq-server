import { Request, Response } from "express";
import bankPrisma from "../../../models/bank.prisma";
export const updateBank = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bankName, bankCode } = req.body;
  try {
    if (!bankName || !bankCode) { // Verificamos que todo los campos estén llenos
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }
    // Verificamos si ya existe un banco con el mismo nombre o código
    const existingBankByName = await bankPrisma.findFirst({
      where: { bankName },
    });
    const existingBankByCode = await bankPrisma.findFirst({
      where: { bankCode },
    });
    if (existingBankByName && existingBankByCode) { // Si existe un banco con el mismo nombre y código retornamos un error confirmando su existencia
      res
        .status(400)
        .json({
          message: `Ya existe un banco con el nombre "${bankName}" y el código "${bankCode}"`,
        });
      return;
    }
    //Procedemos a actualizar los datos bancarios
    const updateBankAccount = await bankPrisma.update({
      where: { id: parseInt(id) },
      data: { 
        bankName, 
        bankCode 
    },
    });
    res
      .status(200)
      .json({
        message: "Banco actualizado con éxito",
        data: updateBankAccount,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
