import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetaAhorro } from '../../models/cuestionario.model';
import { CuestionarioService } from '../../services/cuestionario.service';

@Component({
  selector: 'app-cuestionario-paso-ahorro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuestionario-paso-ahorro.component.html',
  styleUrls: ['./cuestionario-paso-ahorro.component.css'],
})
export class CuestionarioPasoAhorroComponent {
  private servicio = inject(CuestionarioService);

  readonly continuar = output<MetaAhorro>();
  readonly atras = output<void>();

  tenerMetaAhorro = false;
  nombreMeta = '';
  montoObjetivo: number | null = null;
  ahorroActual = 0;
  aporteMensual: number | null = null;
  moneda = 'GTQ';
  razonesAhorro: string[] = [];

  monedas = ['GTQ', 'USD', 'EUR', 'MXN'];

  razones = [
    'Emergencias',
    'Vacaciones',
    'Casa',
    'Auto',
    'Educación',
    'Reserva de inversión',
    'Retiro',
    'Imprevistos',
  ];

  constructor() {
    const previo = this.servicio.datos().ahorro;
    this.tenerMetaAhorro = previo.tenerMetaAhorro;
    this.nombreMeta = previo.nombreMeta;
    this.montoObjetivo = previo.montoObjetivo || null;
    this.ahorroActual = previo.ahorroActual;
    this.aporteMensual = previo.aporteMensual || null;
    this.moneda = previo.moneda;
    this.razonesAhorro = [...previo.razonesAhorro];
  }

  toggleRazon(razon: string): void {
    this.razonesAhorro = this.razonesAhorro.includes(razon)
      ? this.razonesAhorro.filter((r) => r !== razon)
      : [...this.razonesAhorro, razon];
  }

  onContinuar(): void {
    if (this.tenerMetaAhorro && (!this.nombreMeta.trim() || !this.montoObjetivo || this.montoObjetivo <= 0)) {
      return;
    }
    this.servicio.marcarCompletado();
    this.continuar.emit({
      tenerMetaAhorro: this.tenerMetaAhorro,
      nombreMeta: this.nombreMeta,
      montoObjetivo: this.montoObjetivo ?? 0,
      ahorroActual: this.ahorroActual,
      aporteMensual: this.aporteMensual ?? 0,
      moneda: this.moneda,
      razonesAhorro: this.razonesAhorro,
    });
  }
}