import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideTrendingDown } from '@lucide/angular';

@Component({
  selector: 'app-monthly-expenses-card',
  standalone: true,
  imports: [CommonModule, LucideTrendingDown],
  templateUrl: './monthly-expenses-card.component.html',
  styleUrls: ['../monthly-summary-card/_shared-card.css'],
})
export class MonthlyExpensesCardComponent {
  readonly expenses = input<number | null>(null);
  readonly periodLabel = input<string>('este mes');
}
