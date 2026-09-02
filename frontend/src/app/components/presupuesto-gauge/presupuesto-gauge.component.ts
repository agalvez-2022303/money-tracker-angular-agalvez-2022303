import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideWallet } from '@lucide/angular';
import { PresupuestoMensual } from '../../models/presupuesto.model';

@Component({
  selector: 'app-presupuesto-gauge',
  standalone: true,
  imports: [CommonModule, LucideWallet],
  templateUrl: './presupuesto-gauge.component.html',
  styleUrls: ['./presupuesto-gauge.component.css'],
})
export class PresupuestoGaugeComponent {
  readonly presupuesto = input<PresupuestoMensual | null>(null);

  readonly porcentaje = computed(() => {
    const p = this.presupuesto();
    if (!p || p.presupuestoMes <= 0) return 0;
    return Math.min(100, (p.gastado / p.presupuestoMes) * 100);
  });

  readonly restante = computed(() => {
    const p = this.presupuesto();
    if (!p) return 0;
    return p.presupuestoMes - p.gastado;
  });

  readonly estado = computed(() => {
    const pct = this.porcentaje();
    if (pct >= 100) return 'excedido';
    if (pct >= 80) return 'alerta';
    return 'ok';
  });

  readonly rotacion = computed(() => (this.porcentaje() / 100) * 180 - 90);
}