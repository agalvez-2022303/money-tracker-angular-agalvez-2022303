import { Router } from 'express';
import { obtenerMeta, crearOActualizarMeta, eliminarMeta } from '../controllers/savings-goal.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', obtenerMeta);
router.put('/', crearOActualizarMeta);
router.delete('/', eliminarMeta);

export default router;
