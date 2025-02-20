import { Request, Response } from 'express';
import BarberShop from '../../../models/barbershop.prisma';

export const createBarberShop = async (req: Request, res: Response) => {
  try {
    const { name, address, phone, barbers } = req.body;

    if (!name || !address || !phone) {
      res.status(400).json({ message: 'Todos los campos son requeridos.' });
      return;
    }

    /* Verificamos que no exista otra barbería con ese nombre */
    const existingBarberShop = await BarberShop.findFirst({ where: { name } });
    if (existingBarberShop) {
      res.status(400).json({ message: `Ya existe una barbería con el nombre "${name}".` });
      return;
    }

    /* Si se proporcionan IDs de barberos, los relacionamos correctamente */
    let barbersData = undefined;
    if (Array.isArray(barbers) && barbers.length > 0) {
      barbersData = { connect: barbers.map((barberId: number) => ({ id: barberId })) };
    }

    const newBarberShop = await BarberShop.create({ 
      data: { 
        name, 
        address, 
        phone, 
        barbers: barbersData 
      }, 
      include: { barbers: true }
    });

    res.status(201).json({ message: 'Barbería creada con éxito', data: newBarberShop });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
