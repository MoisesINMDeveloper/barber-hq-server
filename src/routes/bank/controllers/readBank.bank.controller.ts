import { Request, Response } from "express";
import bankPrisma from "../../../models/bank.prisma";
export const readBank = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const readbank = await bankPrisma.findUnique({
      where: { id: parseInt(id) }, // Parseamos el id a entero
    });
    if (!readbank) { // Condicionamos si el banco no existe.
      res.status(404).json({ message: "Banco no encontrado" });
      return;
    } else { // si existe el banco, lo retornamos.
      res.status(200).json({ message: "Banco encontrado", data: readbank });
    }
  } catch (error) { // Manejamos el error.
    console.error(error); // Para depuración
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
