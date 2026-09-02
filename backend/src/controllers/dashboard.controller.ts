import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const obtenerDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

  try {
    const [user, savingsGoal, ingresos, gastos, recentTransactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      }),
      prisma.savingsGoal.findUnique({ where: { userId } }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'income',
          date: { gte: inicioMes, lte: finMes },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'expense',
          date: { gte: inicioMes, lte: finMes },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
      }),
    ]);

    res.json({
      user,
      savingsGoal: savingsGoal
        ? {
            id: String(savingsGoal.id),
            currentSavings: savingsGoal.currentSavings,
            targetAmount: savingsGoal.targetAmount,
            targetName: savingsGoal.targetName,
          }
        : null,
      monthlySummary: {
        monthlyIncome: ingresos._sum.amount || 0,
        monthlyExpenses: gastos._sum.amount || 0,
      },
      recentTransactions: recentTransactions.map((t) => ({
        id: String(t.id),
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
};
