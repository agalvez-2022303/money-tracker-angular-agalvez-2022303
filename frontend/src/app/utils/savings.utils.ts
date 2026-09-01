import { SavingsGoal } from '../models/savings-goal.model';

export const PROGRESO_MINIMO = 0;
export const PROGRESO_MAXIMO = 100;

/**
 * Calcula el porcentaje de progreso de una meta de ahorro (0-100).
 * Devuelve 0 si no hay datos o la meta es inválida, y nunca supera 100.
 */
export function calcularPorcentajeProgreso(meta: SavingsGoal): number {
  if (
    !meta ||
    meta.targetAmount <= 0 ||
    meta.currentSavings == null
  ) {
    return PROGRESO_MINIMO;
  }

  const progreso = (meta.currentSavings / meta.targetAmount) * 100;
  return Math.min(PROGRESO_MAXIMO, Math.max(PROGRESO_MINIMO, progreso));
}
