import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatosIngresosGastos } from '../../models/cuestionario.model';
import { CuestionarioService } from '../../services/cuestionario.service';

@Component({
  selector: 'app-cuestionario-paso-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuestionario-paso-ingresos.component.html',
  styleUrls: ['./cuestionario-paso-ingresos.component.css'],
})
export class CuestionarioPasoIngresosComponent {
  private servicio = inject(CuestionarioService);

  readonly continuar = output<DatosIngresosGastos>();
  readonly atras = output<void>();

  ingresoMensual: number | null = null;
  gastoFijoMensual = 0;
  gastoVariableMensual = 0;
  gastoEntretenimiento = 0;
  deudas = 0;
  dependientes = 0;

  constructor() {
    const previo = this.servicio.datos().ingresos;
    this.ingresoMensual = previo.ingresoMensual || null;
    this.gastoFijoMensual = previo.gastoFijoMensual;
    this.gastoVariableMensual = previo.gastoVariableMensual;
    this.gastoEntretenimiento = previo.gastoEntretenimiento;
    this.deudas = previo.deudas;
    this.dependientes = previo.dependientes;
  }

  get gastosTotales(): number {
    return this.gastoFijoMensual + this.gastoVariableMensual + this.gastoEntretenimiento;
  }

  get disponibilidad(): number {
    if (this.ingresoMensual == null) return 0;
    return this.ingresoMensual - this.gastosTotales - this.deudas;
  }

  onContinuar(): void {
    if (this.ingresoMensual == null || this.ingresoMensual < 0) {
      return;
    }
    this.continuar.emit({
      ingresoMensual: this.ingresoMensual,
      gastoFijoMensual: this.gastoFijoMensual,
      gastoVariableMensual: this.gastoVariableMensual,
      gastoEntretenimiento: this.gastoEntretenimiento,
      deudas: this.deudas,
      dependientes: this.dependientes,
    });
  }
}