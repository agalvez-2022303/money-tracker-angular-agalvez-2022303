import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardData, DashboardState, DashboardStatus } from '../models/dashboard.model';
import { SavingsGoal } from '../models/savings-goal.model';
import { MonthlySummary } from '../models/monthly-summary.model';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly URL_API = 'http://localhost:3000/api';

  private estado = signal<DashboardState>({
    status: 'empty',
    data: null,
    error: null,
  });

  readonly state = this.estado.asReadonly();
  readonly status = computed<DashboardStatus>(() => this.estado().status);
  readonly data = computed<DashboardData | null>(() => this.estado().data);

  readonly savingsGoal = computed<SavingsGoal | null>(() => this.estado().data?.savingsGoal ?? null);
  readonly monthlySummary = computed<MonthlySummary | null>(() => this.estado().data?.monthlySummary ?? null);
  readonly recentTransactions = computed<Transaction[]>(() => this.estado().data?.recentTransactions ?? []);
  readonly user = computed<User | null>(() => this.estado().data?.user ?? null);
  readonly error = computed<string | null>(() => this.estado().error);

  constructor() {}

  setearUsuario(user: User): void {
    const actual = this.estado();
    this.estado.set({
      ...actual,
      data: actual.data ? { ...actual.data, user } : null,
      status: actual.data ? actual.status : 'empty',
    });
  }

  cargarDashboard(): void {
    this.estado.set({ status: 'loading', data: null, error: null });

    this.http.get<DashboardData>(`${this.URL_API}/dashboard`).subscribe({
      next: (data) => {
        this.aplicarDatos(data);
      },
      error: (err) => {
        this.errorCarga(err.error?.error || 'Error al cargar el dashboard');
      },
    });
  }

  aplicarDatos(data: DashboardData): void {
    this.estado.set({ status: 'ready', data, error: null });
  }

  errorCarga(mensaje: string): void {
    this.estado.set({ status: 'error', data: null, error: mensaje });
  }

  crearTransaccion(transaccion: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
  }): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      this.http.post<Transaction>(`${this.URL_API}/transactions`, transaccion).subscribe({
        next: (nueva) => {
          this.cargarDashboard();
          resolve(nueva);
        },
        error: (err) => {
          reject(err.error?.error || 'Error al crear transaccion');
        },
      });
    });
  }

  private reiniciar(): void {
    this.estado.set({ status: 'empty', data: null, error: null });
  }
}
