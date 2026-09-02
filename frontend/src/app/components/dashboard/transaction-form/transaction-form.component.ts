import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideX],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent {
  readonly guardar = output<{
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
  }>();
  readonly cancelar = output<void>();

  tipo = signal<'income' | 'expense'>('expense');
  descripcion = signal('');
  monto = signal<number | null>(null);
  categoria = signal('');

  categorias = [
    'Alimentos',
    'Transporte',
    'Vivienda',
    'Servicios',
    'Salud',
    'Entretenimiento',
    'Vestimenta',
    'Educacion',
    'Salario',
    'Freelance',
    'Inversiones',
    'Otros',
  ];

  onGuardar(): void {
    if (!this.descripcion() || !this.monto() || this.monto()! <= 0) {
      return;
    }

    this.guardar.emit({
      description: this.descripcion(),
      amount: this.monto()!,
      type: this.tipo(),
      category: this.categoria() || undefined,
    });
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancelar();
    }
  }
}
