import { Router } from 'express';
import { obtenerDashboard } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, obtenerDashboard);

export default router;
