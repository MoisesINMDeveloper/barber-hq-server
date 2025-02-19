import { Request, Response } from "express";
import bankPrisma from "../../../models/bank.prisma";

export const listBank = async (req:Request, res:Response) => {
    try {
        const banks = await bankPrisma.findMany();
        if (!banks) {
            res.status(404).json({ message: "No hay bancos registrados" });
            return;
        }
        else {
            res.status(200).json({ message: "Bancos encontrados", data: banks });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}