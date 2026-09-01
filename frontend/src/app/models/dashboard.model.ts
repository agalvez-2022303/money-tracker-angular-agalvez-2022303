import { SavingsGoal } from './savings-goal.model';
import { MonthlySummary } from './monthly-summary.model';
import { Transaction } from './transaction.model';
import { User } from './user.model';

export type DashboardStatus = 'loading' | 'empty' | 'error' | 'ready';

export interface DashboardData {
  user: User;
  savingsGoal: SavingsGoal;
  monthlySummary: MonthlySummary;
  recentTransactions: Transaction[];
}

export interface DashboardState {
  status: DashboardStatus;
  data: DashboardData | null;
  error: string | null;
}
