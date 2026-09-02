import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CuestionarioService } from '../../services/cuestionario.service';
import { CuestionarioProgresoComponent } from './cuestionario-progreso/cuestionario-progreso.component';
import { CuestionarioPasoPersonalComponent } from './cuestionario-paso-personal/cuestionario-paso-personal.component';
import { CuestionarioPasoMetasComponent } from './cuestionario-paso-metas/cuestionario-paso-metas.component';
import { CuestionarioPasoIngresosComponent } from './cuestionario-paso-ingresos/cuestionario-paso-ingresos.component';
import { CuestionarioPasoAhorroComponent } from './cuestionario-paso-ahorro/cuestionario-paso-ahorro.component';
import { ThreeDBackgroundComponent } from '../three-d-background/three-d-background.component';
import {
  DatosPersonales,
  MetasFinancieras,
  DatosIngresosGastos,
  MetaAhorro,
} from '../../models/cuestionario.model';
import { LucideArrowLeft, LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-cuestionario',
  standalone: true,
  imports: [
    CommonModule,
    CuestionarioProgresoComponent,
    CuestionarioPasoPersonalComponent,
    CuestionarioPasoMetasComponent,
    CuestionarioPasoIngresosComponent,
    CuestionarioPasoAhorroComponent,
    ThreeDBackgroundComponent,
    LucideArrowLeft,
    LucideCheck,
  ],
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css'],
})
export class CuestionarioComponent {
  private servicio = inject(CuestionarioService);
  private router = inject(Router);

  paso = signal(1);
  finalizado = signal(false);

  readonly datos = this.servicio.datos;

  readonly nombreCompleto = computed(() => {
    const p = this.datos().personales;
    return `${p.nombre} ${p.apellido}`.trim();
  });

  onGuardarPersonales(d: DatosPersonales): void {
    this.servicio.guardarPersonales(d);
    this.paso.set(2);
  }

  onGuardarMetas(d: MetasFinancieras): void {
    this.servicio.guardarMetas(d);
    this.paso.set(3);
  }

  onGuardarIngresos(d: DatosIngresosGastos): void {
    this.servicio.guardarIngresos(d);
    this.paso.set(4);
  }

  onGuardarAhorro(d: MetaAhorro): void {
    this.servicio.guardarAhorro(d);
    this.finalizado.set(true);
  }

  atras(): void {
    if (this.paso() > 1) this.paso.update((p) => p - 1);
  }

  salir(): void {
    this.router.navigate(['/dashboard']);
  }

  irInicio(): void {
    this.router.navigate(['/']);
  }
}