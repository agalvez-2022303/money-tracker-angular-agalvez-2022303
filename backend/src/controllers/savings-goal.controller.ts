import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const obtenerMeta = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const meta = await prisma.savingsGoal.findUnique({
      where: { userId },
    });

    res.json(meta || null);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener meta de ahorro' });
  }
};

export const crearOActualizarMeta = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { currentSavings, targetAmount, targetName } = req.body;

  if (targetAmount == null) {
    res.status(400).json({ error: 'targetAmount es requerido' });
    return;
  }

  try {
    const meta = await prisma.savingsGoal.upsert({
      where: { userId },
      update: {
        ...(currentSavings != null && { currentSavings: parseFloat(currentSavings) }),
        ...(targetAmount != null && { targetAmount: parseFloat(targetAmount) }),
        ...(targetName !== undefined && { targetName }),
      },
      create: {
        userId,
        currentSavings: currentSavings ? parseFloat(currentSavings) : 0,
        targetAmount: parseFloat(targetAmount),
        targetName: targetName || null,
      },
    });

    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar meta de ahorro' });
  }
};

export const eliminarMeta = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const existente = await prisma.savingsGoal.findUnique({ where: { userId } });

    if (!existente) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    await prisma.savingsGoal.delete({ where: { userId } });
    res.json({ message: 'Meta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar meta' });
  }
};
