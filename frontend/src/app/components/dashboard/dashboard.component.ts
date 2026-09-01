import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { User } from '../../models/user.model';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SavingsGoalCardComponent } from './savings-goal-card/savings-goal-card.component';
import { MonthlyIncomeCardComponent } from './monthly-income-card/monthly-income-card.component';
import { MonthlyExpensesCardComponent } from './monthly-expenses-card/monthly-expenses-card.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { AddActivityButtonComponent } from './add-activity-button/add-activity-button.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    SavingsGoalCardComponent,
    MonthlyIncomeCardComponent,
    MonthlyExpensesCardComponent,
    RecentActivityComponent,
    AddActivityButtonComponent,
    TransactionFormComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private servicioAuth = inject(AuthService);
  private dashboardService = inject(DashboardService);

  usuario = signal<User | null>(null);
  mostrarFormulario = signal(false);

  readonly estado = this.dashboardService.status;
  readonly metas = this.dashboardService.savingsGoal;
  readonly resumen = this.dashboardService.monthlySummary;
  readonly transacciones = this.dashboardService.recentTransactions;
  readonly error = this.dashboardService.error;

  ngOnInit(): void {
    const usuario = this.servicioAuth.usuario();
    if (usuario) {
      this.usuario.set(usuario);
      this.dashboardService.setearUsuario(usuario);
      this.dashboardService.cargarDashboard();
    }
  }

  cerrarSesion(): void {
    this.servicioAuth.logout();
  }

  agregarActividad(): void {
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
  }

  async guardarTransaccion(transaccion: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
  }): Promise<void> {
    try {
      await this.dashboardService.crearTransaccion(transaccion);
      this.mostrarFormulario.set(false);
    } catch (error) {
      console.error('Error al guardar transaccion:', error);
    }
  }
}
