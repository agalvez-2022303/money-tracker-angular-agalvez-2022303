import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const crearTransaccion = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { description, amount, type, category, date } = req.body;

  if (!description || amount == null || !type) {
    res.status(400).json({ error: 'description, amount y type son requeridos' });
    return;
  }

  if (!['income', 'expense'].includes(type)) {
    res.status(400).json({ error: 'type debe ser income o expense' });
    return;
  }

  try {
    const transaccion = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        category: category || null,
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });

    res.status(201).json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear transaccion' });
  }
};

export const listarTransacciones = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const transacciones = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

export const obtenerTransaccion = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const id = parseInt(req.params.id);

  try {
    const transaccion = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaccion) {
      res.status(404).json({ error: 'Transaccion no encontrada' });
      return;
    }

    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transaccion' });
  }
};

export const actualizarTransaccion = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const id = parseInt(req.params.id);
  const { description, amount, type, category, date } = req.body;

  try {
    const existente = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existente) {
      res.status(404).json({ error: 'Transaccion no encontrada' });
      return;
    }

    const transaccion = await prisma.transaction.update({
      where: { id },
      data: {
        ...(description && { description }),
        ...(amount != null && { amount: parseFloat(amount) }),
        ...(type && { type }),
        category: category !== undefined ? category : existente.category,
        ...(date && { date: new Date(date) }),
      },
    });

    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar transaccion' });
  }
};

export const eliminarTransaccion = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const id = parseInt(req.params.id);

  try {
    const existente = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existente) {
      res.status(404).json({ error: 'Transaccion no encontrada' });
      return;
    }

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaccion eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transaccion' });
  }
};

export const resumenMensual = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

  try {
    const ingresos = await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'income',
        date: { gte: inicioMes, lte: finMes },
      },
      _sum: { amount: true },
    });

    const gastos = await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
        date: { gte: inicioMes, lte: finMes },
      },
      _sum: { amount: true },
    });

    res.json({
      monthlyIncome: ingresos._sum.amount || 0,
      monthlyExpenses: gastos._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
};

export const actividadReciente = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const transacciones = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    });

    res.json({ transactions: transacciones });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividad reciente' });
  }
};
