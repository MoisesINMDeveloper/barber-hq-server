import {Request, Response } from 'express'
import haircutPrisma from '../../../models/haircut.prisma' 
import userPrisma from '../../../models/user.prisma'

export const createHaircut = async (req:Request, res:Response ) => {
    try{
        const {name, price, description, imageUrl, barberId} = req.body    
        if (!name || !price || !barberId){
            res.status(400).json({message: 'Nombre, precio y barbero son requeridos.'})
            return
        }
        const barberExists = await userPrisma.findUnique({
            where: { id: barberId }
        })
        if (!barberExists){
            res.status(404).json({message: 'Barbero no encontrado.'})
            return
        }
        const haircutExists = await haircutPrisma.findFirst({
            where: { name }
        })
        if (haircutExists){
            res.status(400).json({message: `Ya existe un corte de cabello con el nombre ${name}.`})
            return
        }
        const newHaircut = await haircutPrisma.create({
            data: {
                name,
                price,
                description,
                imageUrl,
                barberId
            }
        })
        res.status(201).json({message: 'Corte de cabello creado exitosamente.',data: newHaircut})
    } 
    catch (error){
        res.status(500).json({message: `Error al crear el corte de cabello: ${error}`})
    }
}