import { Request, Response } from "express";
//import prismaAux from '../../models/privilegios/permisos';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear un nuevo permiso y automáticamente crear en detalles de permisos para cada rol existente
export const createPermisoWithDePermisos = async (req: Request, res: Response): Promise<void> => {
    const { n_per, abrev } = req.body;

    try {
        // Paso 1: Crear el nuevo permiso
        const newPermiso = await prisma.permisos.create({
            data: {
                n_per,
                abrev,
            },
        });

        // Paso 2: Obtener todos los roles existentes
        const allRoles = await prisma.roles.findMany();

        // Paso 3: Crear automáticamente detalles de permiso (De_permiso) para cada rol
        const dePermisos = await prisma.de_permiso.createMany({
            data: allRoles.map(role => ({
                id_rol: role.id_rol,
                id_per: newPermiso.id_per,
                estado: false,  // O puedes ajustar el estado según lo que necesites
            })),
        });

        res.status(201).json({
            message: 'Permiso creado y detalles de permisos generados para todos los roles',
            newPermiso,
            dePermisos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el permiso y los detalles de permisos',
        });
    }
};

export const updatePermisoWithDePermisos = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // id del permiso a actualizar
    const { n_per, abrev } = req.body;

    try {
        // Paso 1: Actualizar el permiso
        const updatedPermiso = await prisma.permisos.update({
            where: {
                id_per: parseInt(id),
            },
            data: {
                n_per,
                abrev,
            },
        });

        res.status(200).json({
            message: 'Permiso actualizado correctamente',
            updatedPermiso,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar el permiso',
        });
    }
};

export const deletePermisoWithDePermisos = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // id del permiso a eliminar

    try {
        // Paso 1: Eliminar todos los detalles de permiso relacionados con este permiso
        await prisma.de_permiso.deleteMany({
            where: {
                id_per: parseInt(id),
            },
        });

        // Paso 2: Eliminar el permiso
        const deletedPermiso = await prisma.permisos.delete({
            where: {
                id_per: parseInt(id),
            },
        });

        res.status(200).json({
            message: 'Permiso y detalles de permiso eliminados correctamente',
            deletedPermiso,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar el permiso',
        });
    }
};



export const createPermiso = async (req: Request, res: Response): Promise<void> => {
    const { n_per, abrev } = req.body;
    try {
        const newPermiso = await prisma.permisos.create({
            data: {
                n_per,
                abrev,
            },
        });
        res.status(201).json(newPermiso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el permiso' });
    }
};

// Obtener todos los permisos
export const getAllPermisos = async (req: Request, res: Response): Promise<void> => {
    try {
        const permisos = await prisma.permisos.findMany();
        res.status(200).json(permisos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los permisos' });
    }
};

// Actualizar un permiso por su ID
export const updatePermiso = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { n_per, abrev } = req.body;
    try {
        const existingPermiso = await prisma.permisos.findUnique({
            where: { id_per: parseInt(id) },
        });

        if (!existingPermiso) {
            res.status(404).json({ message: 'Permiso no encontrado' });
        }

        const updatedPermiso = await prisma.permisos.update({
            where: { id_per: parseInt(id) },
            data: {
                n_per,
                abrev,
            },
        });

        res.status(200).json(updatedPermiso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el permiso' });
    }
};

// Eliminar un permiso por su ID
export const deletePermiso = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const existingPermiso = await prisma.permisos.findUnique({
            where: { id_per: parseInt(id) },
        });

        if (!existingPermiso) {
            res.status(404).json({ message: 'Permiso no encontrado' });
        }

        await prisma.permisos.delete({
            where: { id_per: parseInt(id) },
        });

        res.status(200).json({ message: 'Permiso eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el permiso' });
    }
};