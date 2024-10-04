/*import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** CREAR UN NUEVO ROL 
export const nuevoRol = async (req: Request, res: Response, next: NextFunction) => {
    const { n_rol, abrev, permissions } = req.body;

    try {
        const nuevoRol = await prisma.roles.create({
            data: {
                n_rol,
                abrev,
                deta_perm: {
                    create: permissions.map((permissionId: number) => ({
                        permission: { connect: { id: permissionId } }
                    }))
                }
            }
        });
        res.json({ mensaje: 'Se agregó un nuevo rol', data: nuevoRol });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


/** OBTENER ROLES 
export const obtenerRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await prisma.roles.findMany({
            include: { permissions: true } // Para incluir las relaciones con permisos
        });
        res.json(roles);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


/** OBTENER ROL - POR ID 
export const obtenerRol = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const rol = await prisma.roles.findUnique({
            where: { id: Number(id) },
            include: { permissions: true }
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'El rol no existe' });
        }

        res.json(rol);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** ACTUALIZAR  ROL 
export const actualizarRol = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, abbreviation, permissions } = req.body;

    try {
        const rolActualizado = await prisma.roles.update({
            where: { id: Number(id) },
            data: {
                name,
                abbreviation,
                permissions: {
                    deleteMany: {}, // Eliminar todas las relaciones previas
                    create: permissions.map((permissionId: number) => ({
                        permission: { connect: { id: permissionId } }
                    }))
                }
            }
        });

        res.json({ mensaje: 'Rol actualizado correctamente', data: rolActualizado });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** ELIMIAR EL ROL 
export const eliminarRol = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await prisma.roles.delete({
            where: { id: Number(id) }
        });
        res.json({ mensaje: 'Rol eliminado correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
*/

/**
 * {
  "name": "Administrador unico",
  "abbreviation": "ADM",
  "permissions": [1, 2, 3]  // IDs de los permisos
}
 * 
{
    "name": "Personal de planta",
    "abbreviation": "PP",
    "permissions": []
}

 * 
 * 
 */