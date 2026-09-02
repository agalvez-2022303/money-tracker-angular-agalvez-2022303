import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetasFinancieras, PerfilRiesgo } from '../../models/cuestionario.model';
import { CuestionarioService } from '../../services/cuestionario.service';

@Component({
  selector: 'app-cuestionario-paso-metas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuestionario-paso-metas.component.html',
  styleUrls: ['./cuestionario-paso-metas.component.css'],
})
export class CuestionarioPasoMetasComponent {
  private servicio = inject(CuestionarioService);

  readonly continuar = output<MetasFinancieras>();
  readonly atras = output<void>();

  metasComunes = [
    'Fondo de emergencia',
    'Comprar una casa',
    'Comprar un auto',
    'Viajar',
    'Educación',
    'Jubilación',
    'Emprender un negocio',
    'Pagar deudas',
    'Inversiones',
  ];

  metaPrincipal = '';
  plazo: 'corto' | 'mediano' | 'largo' = 'corto';
  perfilRiesgo: PerfilRiesgo = 'moderado';
  sabe_Ahorrar = false;
  llevaPresupuesto = false;

  perfiles: { valor: PerfilRiesgo; etiqueta: string; desc: string }[] = [
    { valor: 'conservador', etiqueta: 'Conservador', desc: 'Prefiero seguridad, bajo riesgo' },
    { valor: 'moderado', etiqueta: 'Moderado', desc: 'Balance entre seguridad y crecimiento' },
    { valor: 'agresivo', etiqueta: 'Agresivo', desc: 'Busco máximo crecimiento, acepto riesgo' },
  ];

  constructor() {
    const previo = this.servicio.datos().metas;
    this.metaPrincipal = previo.metaPrincipal;
    this.plazo = previo.plazo;
    this.perfilRiesgo = previo.perfilRiesgo;
    this.sabe_Ahorrar = previo.sabe_Ahorrar;
    this.llevaPresupuesto = previo.llevaPresupuesto;
  }

  esUnaMetaComun(meta: string): boolean {
    return this.metasComunes.includes(meta);
  }

  alSeleccionarMeta(meta: string): void {
    this.metaPrincipal = this.metaPrincipal === meta ? '' : meta;
  }

  onContinuar(): void {
    if (!this.metaPrincipal) {
      return;
    }
    this.continuar.emit({
      metaPrincipal: this.metaPrincipal,
      plazo: this.plazo,
      perfilRiesgo: this.perfilRiesgo,
      sabe_Ahorrar: this.sabe_Ahorrar,
      llevaPresupuesto: this.llevaPresupuesto,
    });
  }
}
