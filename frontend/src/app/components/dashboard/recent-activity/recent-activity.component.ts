import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideClock } from '@lucide/angular';
import { Transaction } from '../../../models/transaction.model';
import { ActivityItemComponent } from '../activity-item/activity-item.component';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, LucideClock, ActivityItemComponent],
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.css'],
})
export class RecentActivityComponent {
  readonly transactions = input<Transaction[]>([]);
}
