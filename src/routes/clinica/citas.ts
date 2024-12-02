import express from 'express';
import {
  crearCita,
  obtenerCitas,
  actualizarCita,
  eliminarCita,
} from '../../controllers/clinica/citas';

const router = express.Router();

router.get('/appointments', obtenerCitas);
router.post('/appointments', crearCita);
router.put('/appointments/:id', actualizarCita);
router.delete('/appointments/:id', eliminarCita);

export default router;
