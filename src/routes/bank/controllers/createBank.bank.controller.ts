import { Request, Response } from 'express';
import bankPrisma from '../../../models/bank.prisma';

export const bankAccount = async (req: Request, res: Response): Promise<void> => {
  const { bankName, bankCode } = req.body;

  try {
    //--Prevalidaciones--//
    if (!bankName || !bankCode) {
      res.status(400).json({ message: 'Todos los campos son requeridos.' });
      return;
    }

    //--Verificamos si ya existe un banco con el mismo nombre o código--//
    const existingBankByName = await bankPrisma.findFirst({ where: { bankName } });
    const existingBankByCode = await bankPrisma.findFirst({ where: { bankCode } });

    if (existingBankByName && existingBankByCode) {
      res.status(400).json({ 
        message: `Ya existe un banco con el nombre "${bankName}" y el código "${bankCode}".` 
      });
      return;
    }

    if (existingBankByName) {
      res.status(400).json({ 
        message: `Ya existe un banco con el nombre "${bankName}".` 
      });
      return;
    }

    if (existingBankByCode) {
      res.status(400).json({ 
        message: `Ya existe un banco con el código "${bankCode}".` 
      });
      return;
    }

    //--Creamos el banco--//
    const newBank = await bankPrisma.create({ data: { bankName, bankCode } });
    res.status(201).json({ message: 'Banco creado con éxito', data: newBank });
  } catch (error) {
    console.error(error); // Para depuración
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
