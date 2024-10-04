import express from 'express'
import { createUserWithHashedPasswordAndToken, createUser,loginUser, newcreate } from '../../controllers/privilegios/usuarios';

const router = express.Router();

/** RUTAS REGISTRO Y LOGIN */
router.post('/register', createUser);  // Registrar usuario
router.post('/login', loginUser);  // Iniciar sesión

export default router;