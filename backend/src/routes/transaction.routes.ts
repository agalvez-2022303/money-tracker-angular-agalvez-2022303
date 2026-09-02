import { Router } from 'express';
import {
  crearTransaccion,
  listarTransacciones,
  obtenerTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
  resumenMensual,
  actividadReciente,
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', crearTransaccion);
router.get('/', listarTransacciones);
router.get('/recent', actividadReciente);
router.get('/summary', resumenMensual);
router.get('/:id', obtenerTransaccion);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);

export default router;
