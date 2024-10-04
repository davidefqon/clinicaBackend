/* IMPORTAMOS DE DOTENV */
import dotenv from 'dotenv';
dotenv.config()

/** IMPORTAMOS DE LIBRERIAS  */
import express from 'express';
const cors = require('cors')

/** IMPORTAMOS RUTAS DE ARCHIVOS */
import authRoutes from './routes/AuthRoutes'
import subUnidad from './routes/privilegios/subUnidad'
import Permisos from './routes/privilegios/permisos'
import Roles from './routes/privilegios/roles'
import De_permisos from './routes/privilegios/de_permisos'
import Usuarios from './routes/privilegios/usuarios'

// APP CON EXPRESS
const app = express()
app.use(express.json());

// CORS
app.use(cors()); 

// RUTAS
app.use('/auth', authRoutes);
//app.use('/api', roleRoutes);
//app.use('/api', permission);
app.use('/api', subUnidad);
app.use('/api', Roles);
app.use('/api', Permisos);
app.use('/api', De_permisos);
app.use('/api/auth', Usuarios)

//app.use('/api' )

// AUTENTICACION


// Hacer una apirest de usuarios

console.log("Esto esta siendo ejecutado")

export default app;