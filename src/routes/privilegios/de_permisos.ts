import express from 'express'
import { createDePermiso,deleteDePermiso,getAllDePermisos,updateDePermiso } from '../../controllers/privilegios/de_permisos';

const router = express.Router();

/** RUTAS REGISTRO Y LOGIN */
router.post('/de_permisos', createDePermiso);
router.get('/de_permisos', getAllDePermisos);
router.put('/de_permisos/:id', updateDePermiso);
router.delete('/de_permisos/:id', deleteDePermiso);

export default router;