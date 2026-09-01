import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const salt = await bcrypt.genSalt(10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@moneytracker.com' },
    update: {},
    create: {
      email: 'admin@moneytracker.com',
      password: await bcrypt.hash('admin123', salt),
      name: 'Administrador',
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@moneytracker.com' },
    update: {},
    create: {
      email: 'demo@moneytracker.com',
      password: await bcrypt.hash('demo123', salt),
      name: 'Usuario Demo',
    },
  });

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  const transaccionesAdmin = [
    { description: 'Salario mensual', amount: 8500, type: 'income', category: 'Salario', date: inicioMes },
    { description: 'Freelance proyecto web', amount: 2200, type: 'income', category: 'Freelance', date: new Date(inicioMes.getTime() + 2 * 86400000) },
    { description: 'Alquiler apartamento', amount: 2800, type: 'expense', category: 'Vivienda', date: new Date(inicioMes.getTime() + 1 * 86400000) },
    { description: 'Supermercado', amount: 1250, type: 'expense', category: 'Alimentos', date: new Date(inicioMes.getTime() + 3 * 86400000) },
    { description: 'Servicio de internet', amount: 350, type: 'expense', category: 'Servicios', date: new Date(inicioMes.getTime() + 4 * 86400000) },
    { description: 'Gimnasio mensual', amount: 280, type: 'expense', category: 'Salud', date: new Date(inicioMes.getTime() + 5 * 86400000) },
    { description: 'Cena restaurante', amount: 420, type: 'expense', category: 'Entretenimiento', date: new Date(inicioMes.getTime() + 6 * 86400000) },
    { description: 'Venta de articulo usado', amount: 350, type: 'income', category: 'Otros', date: new Date(inicioMes.getTime() + 7 * 86400000) },
    { description: 'Gasolina', amount: 500, type: 'expense', category: 'Transporte', date: new Date(inicioMes.getTime() + 8 * 86400000) },
    { description: 'Compra ropa', amount: 680, type: 'expense', category: 'Vestimenta', date: new Date(inicioMes.getTime() + 9 * 86400000) },
  ];

  const existentes = await prisma.transaction.count({ where: { userId: admin.id } });

  if (existentes === 0) {
    for (const t of transaccionesAdmin) {
      await prisma.transaction.create({
        data: { ...t, userId: admin.id },
      });
    }
    console.log('Transacciones de ejemplo creadas para admin');
  }

  const metaExistente = await prisma.savingsGoal.findUnique({ where: { userId: admin.id } });

  if (!metaExistente) {
    await prisma.savingsGoal.create({
      data: {
        userId: admin.id,
        currentSavings: 3200,
        targetAmount: 15000,
        targetName: 'Fondo de emergencia',
      },
    });
    console.log('Meta de ahorro de ejemplo creada para admin');
  }

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
