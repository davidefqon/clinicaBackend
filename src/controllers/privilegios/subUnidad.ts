import { Request, Response } from "express";
import prisma from '../../models/privilegios/subUnidad';

/* REGISTRO DEl SISTEMA */
export const newSubUnidad = async (req: Request, res: Response): Promise<void> => {
    const {nombre, abreviatura} = req.body;
    try {
        // VALIDAMOS EL PASSWORD Y USUARIO
        if(!nombre) throw new Error('El nombre de la subunidad es obligatorio');
        //if(!usuario) throw new Error('El usuario es obligatorio');


        const subUnidad = await prisma.create(
            {
                data: {
                    n_subUni: nombre,
                    abrev: abreviatura,
                }
            }
        )

        res.status(201).json({subUnidad});
        
    } catch (error: any) {
        // TODO para manejar los errores

        // VALIDAR EL USUARIO
        if(!nombre){
            res.status(400).json({
                message: 'Problemas con el nombre'
            })
        }
        

        // VALIDAR DUPLICIDAD
        if(error?.code === 'P2002' && error?.meta?.target?.includes('nombre')){
            res.status(500).json({
                message: 'El nombre ya existe'
            })
        }

        //Mejorar los errores 
        console.log(error);
        res.status(500).json({
            error: 'Hubo un error en el registro'
        })
    }
}

export const getAllSubUnidades = async (req: Request, res: Response): Promise<void> => {
    try {
        // Consultamos todas las subunidades en la base de datos
        const subUnidades = await prisma.findMany();

        // Si no hay subunidades, devolvemos un mensaje
        if (!subUnidades || subUnidades.length === 0) {
            res.status(404).json({
                message: 'No se encontraron subunidades',
            });
        }

        // Enviamos las subunidades encontradas
        res.status(200).json(subUnidades);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: 'Hubo un error al obtener las subunidades',
            error: error.message,
        });
    }
};

export const updateSubUnidad = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Asumimos que el ID viene en los parámetros de la ruta
    const { nombre, abreviatura } = req.body;

    try {
        // Validar que se proporciona el ID
        if (!id) {
            res.status(400).json({ message: 'El ID de la subunidad es obligatorio' });
        }

        // Validar que se proporciona al menos un campo para actualizar
        if (!nombre && !abreviatura) {
            res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
        }

        // Convertir el ID a número (si es necesario)
        const subUnidadId = parseInt(id, 10);

        // Verificar que el registro existe
        const existingSubUnidad = await prisma.findUnique({
            where: { id_subUni: subUnidadId },
        });

        if (!existingSubUnidad) {
            res.status(404).json({ message: 'Subunidad no encontrada' });
        }

        // Actualizar la subunidad
        const updatedSubUnidad = await prisma.update({
            where: { id_subUni: subUnidadId },
            data: {
                n_subUni: nombre || existingSubUnidad?.n_subUni,
                abrev: abreviatura || existingSubUnidad?.abrev,
            },
        });

        // Enviar respuesta exitosa
        res.status(200).json({ subUnidad: updatedSubUnidad });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: 'Hubo un error al actualizar la subunidad',
            error: error.message,
        });
    }
};

export const deleteSubUnidad = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Asumimos que el ID viene en los parámetros de la ruta

    try {
        // Validar que se proporciona el ID
        if (!id) {
            res.status(400).json({ message: 'El ID de la subunidad es obligatorio' });
        }

        // Convertir el ID a número (si es necesario)
        const subUnidadId = parseInt(id, 10);

        // Verificar que el registro existe
        const existingSubUnidad = await prisma.findUnique({
            where: { id_subUni: subUnidadId },
        });

        // Manejo si `existingSubUnidad` es null
        if (!existingSubUnidad) {
            res.status(404).json({ message: 'Subunidad no encontrada' });
        }

        // Eliminar la subunidad
        await prisma.delete({
            where: { id_subUni: subUnidadId },
        });

        // Enviar respuesta exitosa
        res.status(200).json({ message: 'Subunidad eliminada con éxito' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: 'Hubo un error al eliminar la subunidad',
            error: error.message,
        });
    }
};