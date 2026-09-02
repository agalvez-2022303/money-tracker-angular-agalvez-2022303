import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideTarget } from '@lucide/angular';
import { SavingsGoal } from '../../../models/savings-goal.model';
import { calcularPorcentajeProgreso } from '../../../utils/savings.utils';

@Component({
  selector: 'app-savings-goal-card',
  standalone: true,
  imports: [CommonModule, LucideTarget],
  templateUrl: './savings-goal-card.component.html',
  styleUrls: ['./savings-goal-card.component.css'],
})
export class SavingsGoalCardComponent {
  readonly meta = input<SavingsGoal | null>(null);

  readonly porcentaje = computed(() =>
    calcularPorcentajeProgreso(this.meta() ?? { currentSavings: 0, targetAmount: 0 })
  );

  readonly tieneMeta = computed(() => !!this.meta() && this.meta()!.targetAmount > 0);

  readonly radio = 54;
  readonly circunferencia = 2 * Math.PI * this.radio;

  readonly offset = computed(() =>
    this.circunferencia - (this.porcentaje() / 100) * this.circunferencia
  );
}
