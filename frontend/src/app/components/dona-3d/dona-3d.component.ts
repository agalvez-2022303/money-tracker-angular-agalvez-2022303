import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosDona } from '../../models/categoria.model';

export interface SegmentoDona {
  pct: number;
  offset: number;
  color: string;
  nombre: string;
  monto: number;
}

@Component({
  selector: 'app-dona-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dona-3d.component.html',
  styleUrls: ['./dona-3d.component.css'],
})
export class Dona3DComponent {
  readonly datos = input.required<DatosDona>();
  readonly radio = 70;
  readonly circunferencia = 2 * Math.PI * this.radio;

  readonly segmentos = computed<SegmentoDona[]>(() => {
    const d = this.datos();
    if (!d || d.total <= 0) return [];
    let acumulado = 0;
    return d.categorias
      .filter((c) => c.monto > 0)
      .map((c) => {
        const pct = (c.monto / d.total) * 100;
        const offset = acumulado;
        acumulado += pct;
        return {
          pct,
          offset: (offset / 100) * this.circunferencia,
          color: c.color,
          nombre: c.nombre,
          monto: c.monto,
        };
      });
  });

  readonly tieneDatos = computed(() => this.segmentos().length > 0);
}