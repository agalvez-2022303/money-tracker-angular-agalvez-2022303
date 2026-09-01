import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideArrowDownLeft, LucideArrowUpRight } from '@lucide/angular';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-activity-item',
  standalone: true,
  imports: [CommonModule, LucideArrowDownLeft, LucideArrowUpRight],
  templateUrl: './activity-item.component.html',
  styleUrls: ['./activity-item.component.css'],
})
export class ActivityItemComponent {
  readonly transaccion = input.required<Transaction>();

  readonly esIngreso = computed(() => this.transaccion().type === 'income');

  readonly fecha = computed(() => {
    const fecha = new Date(this.transaccion().date);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });
}
