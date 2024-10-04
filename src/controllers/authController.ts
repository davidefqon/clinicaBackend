import { Request, Response } from "express";
import {comparePasswords, hashPassword} from '../services/password.service' 
import prisma from '../models/user';
import { generateToken } from "../services/auth.service";

/* REGISTRO DEl SISTEMA */
export const register = async (req: Request, res: Response): Promise<void> => {
    const {usuario, password} = req.body;
    try {
        // VALIDAMOS EL PASSWORD Y USUARIO
        if(!password) throw new Error('El password es obligatorio');
        if(!usuario) throw new Error('El usuario es obligatorio');

        const hashedPassword = await hashPassword(password);

        const user = await prisma.create(
            {
                data: {
                    usuario,
                    password: hashedPassword
                }
            }
        )

        // Generarmos el token
        const token = generateToken(user)
        res.status(201).json({token});
        
    } catch (error: any) {
        // TODO para manejar los errores

        // VALIDAR EL USUARIO
        if(!usuario){
            res.status(400).json({
                message: 'El uusario es obligatorio'
            })
        }
        
        //VALIDAR EL PASSWORD
        if(!password){
            res.status(400).json({
                message: 'La contrasenia es obligaroria'
            })
        }

        // VALIDAR DUPLICIDAD
        if(error?.code === 'P2002' && error?.meta?.target?.includes('usuario')){
            res.status(500).json({
                message: 'El usuario ya existe'
            })
        }

        //Mejorar los errores 
        console.log(error);
        res.status(500).json({
            error: 'Hubo un error en el registro'
        })
    }
}



/* LOGIN DEl SISTEMA */
export const login = async(req: Request, res: Response): Promise<void> => {
    const {usuario, password} = req.body;
    
    try {

        // VALIDAR EL USUARIO
        if(!usuario){
            res.status(400).json({
                message: 'El uusario es obligatorio'
            })
        }
        
        //VALIDAR EL PASSWORD
        if(!password){
            res.status(400).json({
                message: 'La contrasenia es obligaroria'
            })
        }

        const user = await prisma.findUnique({where: {usuario}})
        
        // Comprobamos si el usuario existe
        if(!user){
            res.status(404).json({error: 'Usuario no encontrado'});
            return 
        }

        // Comparamos las password
        const passwordMatch = await comparePasswords(password, user.password);
        if(!passwordMatch){
            res.status(401).json({
                error: 'Usuario y contrasenias no coinciden'
            })
        }

        const token = generateToken(user)
        res.status(201).json({token})
        
    } catch (error: any) {
        console.log('Error: ' + error)
    }
}
