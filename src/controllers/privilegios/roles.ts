import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRoleWithDePermisos = async (req: Request, res: Response): Promise<void> => {
    const { n_rol, abrev } = req.body;
    
    try {
        // Paso 1: Crear el nuevo rol
        const newRole = await prisma.roles.create({
            data: {
                n_rol,
                abrev,
            },
        });
        
        // Paso 2: Obtener todos los permisos existentes
        const allPermisos = await prisma.permisos.findMany();
        
        // Paso 3: Crear un registro en `De_permiso` para cada permiso existente
        const dePermisosData = allPermisos.map((permiso) => ({
            id_rol: newRole.id_rol,
            id_per: permiso.id_per,
            estado: false, // o el estado que necesites por defecto
        }));
        
        await prisma.de_permiso.createMany({
            data: dePermisosData,
        });
        
        res.status(201).json({
            message: 'Rol y detalles de permisos creados correctamente',
            newRole,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el rol y los detalles de permisos',
        });
    }
};

export const deleteRoleWithDePermisos = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // Paso 1: Eliminar todos los registros de `De_permiso` asociados con el rol
        await prisma.de_permiso.deleteMany({
            where: {
                id_rol: parseInt(id),
            },
        });

        // Paso 2: Eliminar el rol
        const deletedRole = await prisma.roles.delete({
            where: {
                id_rol: parseInt(id),
            },
        });

        res.status(200).json({
            message: 'Rol y detalles de permisos eliminados correctamente',
            deletedRole,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar el rol y los detalles de permisos',
        });
    }
};


// Crear un nuevo rol
export const createRol = async (req: Request, res: Response): Promise<void> => {
    const { n_rol, abrev } = req.body;
    try {
        const newRol = await prisma.roles.create({
            data: {
                n_rol,
                abrev,
            },
        });
        res.status(201).json(newRol);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el rol' });
    }
};

// Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await prisma.roles.findMany();
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los roles' });
    }
};

// Actualizar un rol por su ID
export const updateRol = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { n_rol, abrev } = req.body;
    try {
        const existingRol = await prisma.roles.findUnique({
            where: { id_rol: parseInt(id) },
        });

        if (!existingRol) {
            res.status(404).json({ message: 'Rol no encontrado' });
        }

        const updatedRol = await prisma.roles.update({
            where: { id_rol: parseInt(id) },
            data: {
                n_rol,
                abrev,
            },
        });

        res.status(200).json(updatedRol);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};

// Eliminar un rol por su ID
export const deleteRol = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const existingRol = await prisma.roles.findUnique({
            where: { id_rol: parseInt(id) },
        });

        if (!existingRol) {
            res.status(404).json({ message: 'Rol no encontrado' });
        }

        await prisma.roles.delete({
            where: { id_rol: parseInt(id) },
        });

        res.status(200).json({ message: 'Rol eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el rol' });
    }
};