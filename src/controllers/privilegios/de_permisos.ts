import { Request, Response } from "express";
import prisma from '../../models/privilegios/de_permisos';

// Crear un nuevo detalle de permiso
export const createDePermiso = async (req: Request, res: Response): Promise<void> => {
    const { id_rol, id_per, estado } = req.body;
    try {
        const newDePermiso = await prisma.create({
            data: {
                id_rol,
                id_per,
                estado,
            },
        });
        res.status(201).json(newDePermiso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el detalle del permiso' });
    }
};

// Obtener todos los detalles de permiso
export const getAllDePermisos = async (req: Request, res: Response): Promise<void> => {
    try {
        const dePermisos = await prisma.findMany({
            include: {
                permisos: true,
                roles: true,
            },
        });
        res.status(200).json(dePermisos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los detalles de los permisos' });
    }
};

// Actualizar un detalle de permiso por su ID
export const updateDePermiso = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { id_rol, id_per, estado } = req.body;
    try {
        const existingDePermiso = await prisma.findUnique({
            where: { id_Dper: parseInt(id) },
        });

        if (!existingDePermiso) {
            res.status(404).json({ message: 'Detalle de permiso no encontrado' });
        }

        const updatedDePermiso = await prisma.update({
            where: { id_Dper: parseInt(id) },
            data: {
                id_rol,
                id_per,
                estado,
            },
        });

        res.status(200).json(updatedDePermiso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el detalle del permiso' });
    }
};

// Eliminar un detalle de permiso por su ID
export const deleteDePermiso = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const existingDePermiso = await prisma.findUnique({
            where: { id_Dper: parseInt(id) },
        });

        if (!existingDePermiso) {
            res.status(404).json({ message: 'Detalle de permiso no encontrado' });
        }

        await prisma.delete({
            where: { id_Dper: parseInt(id) },
        });

        res.status(200).json({ message: 'Detalle de permiso eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el detalle del permiso' });
    }
};
