import express from 'express'
import { createRol,createRoleWithDePermisos, deleteRoleWithDePermisos,getAllRoles,updateRol,deleteRol } from '../../controllers/privilegios/roles';

const router = express.Router();

/** RUTAS REGISTRO Y LOGIN */
router.post('/roles', createRoleWithDePermisos);
router.get('/roles', getAllRoles);
router.put('/roles/:id', updateRol);
router.delete('/roles/:id', deleteRoleWithDePermisos);

export default router;