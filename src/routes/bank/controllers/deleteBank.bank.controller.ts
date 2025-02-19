import { Request, Response } from "express";
import bankPrisma from "../../../models/bank.prisma";

export const deleteBank = async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        const deletedBank = await bankPrisma.delete({
            where: { id: parseInt(id) },
        });
        if (!deletedBank) {
            res.status(404).json({ message: "Banco no encontrado" });
            return;
        }
        else {
            res.status(200).json({ message: "Banco eliminado con éxito", data: deletedBank });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}