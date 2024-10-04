import { Request, Response } from 'express';
//import bcrypt from 'bcryptjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import prisma from '../prisma';  // Asegúrate de usar el cliente Prisma adecuado
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'secretKey';  // Define una secret key

export const createUserWithHashedPasswordAndToken = async (req: Request, res: Response): Promise<void> => {
    const { dni, n_usu, password, rol_id, id_sub } = req.body;

    try {
        // Verificar si ya existe un usuario con el mismo DNI
        const existingUser = await prisma.usuario.findFirst({
            where: { dni }
        });

        if (existingUser) {
            res.status(400).json({
                message: 'El usuario ya existe'
            });
        }

        // Hashear el password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await prisma.usuario.create({
            data: {
                dni,
                n_usu,
                password: hashedPassword,  // Guardar el password hasheado
                estado: true,
                rol_id,
                id_sub
            }
        });

        // Generar un token
        const token = jwt.sign(
            { userId: newUser.dni, role: newUser.rol_id },
            SECRET_KEY,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        res.status(201).json({
            message: 'Usuario creado correctamente',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el usuario',
        });
    }
};

export const newcreate = async (req: Request, res: Response): Promise<void> => {
    const { dni, n_usu, password, rol_id, id_sub } = req.body;
    
    try {
        // Verificar si ya existe un usuario con el mismo DNI
        
        // Hashear el password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log("pasa aquiiiiii")
        // Crear el nuevo usuario
        const newUser = await prisma.usuario.create({
            data: {
                dni,
                n_usu,
                password: hashedPassword,  // Guardar el password hasheado
                estado: true,
                rol_id,
                id_sub
            }
        });

        // Generar un token
        /*const token = jwt.sign(
            { userId: newUser.dni, role: newUser.rol_id },
            SECRET_KEY,
            { expiresIn: '1h' } // El token expira en 1 hora
        );*/
        res.json(newUser);
        res.status(201).json({
            message: 'Usuario creado correctamente',
            //token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el usuario',
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { usuario, password } = req.body;  // Se cambia dni a usuario

    try {
        // Buscar el usuario por nombre de usuario (n_usu)
        const existingUser = await prisma.usuario.findFirst({
            where: { n_usu: usuario }  // Cambiamos a findFirst ya que n_usu no es único
        });

        // Verificar si el usuario existe
        if (!existingUser) {
            res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        // Comparar la contraseña ingresada con la contraseña hasheada almacenada
        let isPasswordValid = false;
        if(existingUser)
        {   isPasswordValid = await bcrypt.compare(password, existingUser.password);
        }

        if (!isPasswordValid) {
            res.status(401).json({
                message: 'Credenciales incorrectas'
            });
        }

        // Generar un token
        if(existingUser)
        {
            const token = jwt.sign(
                { userId: existingUser.dni, role: existingUser.rol_id },
                SECRET_KEY,
                { expiresIn: '1h' }  // El token expira en 1 hora
            );   
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el proceso de inicio de sesión',
        });
    }
};


export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { dni, n_usu, password, rol_id, id_sub } = req.body;

  try {
    // Verificar si el usuario con la misma combinación de dni, rol_id, id_sub ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: {
        dni_rol_id_id_sub: {
          dni,
          rol_id,
          id_sub,
        },
      },
    });

    if (existingUser) {
      res.status(400).json({ message: 'El usuario con este rol y subunidad ya existe.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await prisma.usuario.create({
      data: {
        dni,
        n_usu,
        password: hashedPassword,
        rol_id,
        id_sub,
        estado: true,
      },
    });

    res.status(201).json({ message: 'Usuario creado correctamente.', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario.', error });
  } finally {
    await prisma.$disconnect();
  }
  };


  /* 
  
  {
  "dni": "74652485",
  "n_usu": "ssss",
  "password": "root",
  "rol_id": 1,
  "id_sub": 1
}
  */