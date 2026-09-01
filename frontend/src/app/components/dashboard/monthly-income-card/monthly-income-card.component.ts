import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideTrendingUp } from '@lucide/angular';

@Component({
  selector: 'app-monthly-income-card',
  standalone: true,
  imports: [CommonModule, LucideTrendingUp],
  templateUrl: './monthly-income-card.component.html',
  styleUrls: ['../monthly-summary-card/_shared-card.css'],
})
export class MonthlyIncomeCardComponent {
  readonly income = input<number | null>(null);
  readonly periodLabel = input<string>('este mes');
}
