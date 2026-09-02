import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucidePieChart } from '@lucide/angular';
import { Transaction } from '../../models/transaction.model';
import { DatosDona } from '../../models/categoria.model';
import { Dona3DComponent } from '../dona-3d/dona-3d.component';

const PALETA = [
  '#22C55E',
  '#4ade80',
  '#16a34a',
  '#f7931a',
  '#627eea',
  '#9945ff',
  '#f59e0b',
  '#ef4444',
  '#e6007a',
];

@Component({
  selector: 'app-desglose-categorias',
  standalone: true,
  imports: [CommonModule, LucidePieChart, Dona3DComponent],
  templateUrl: './desglose-categorias.component.html',
  styleUrls: ['./desglose-categorias.component.css'],
})
export class DesgloseCategoriasComponent {
  readonly transacciones = input<Transaction[]>([]);

  readonly datos = computed<DatosDona | null>(() => {
    const tx = this.transacciones();
    if (!tx.length) return null;

    const gastos = tx.filter((t) => t.type === 'expense');
    if (!gastos.length) return null;

    const acumulador = new Map<string, number>();
    gastos.forEach((g) => {
      const categoria = g.category || 'Sin categoría';
      acumulador.set(categoria, (acumulador.get(categoria) ?? 0) + (g.amount ?? 0));
    });

    const categorias = Array.from(acumulador.entries())
      .map(([nombre, monto], i) => ({
        nombre,
        monto,
        color: PALETA[i % PALETA.length],
      }))
      .sort((a, b) => b.monto - a.monto);

    const total = categorias.reduce((s, c) => s + c.monto, 0);
    return { total, categorias };
  });
}