import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CuestionarioService } from '../../services/cuestionario.service';
import { ThreeDCubeComponent } from '../three-d-cube/three-d-cube.component';
import { LucideArrowRight, LucideArrowLeft, LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ThreeDCubeComponent, LucideArrowRight, LucideArrowLeft, LucideCheck],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
})
export class OnboardingComponent {
  private servicio = inject(CuestionarioService);
  private router = inject(Router);

  paso = 1;
  terminado = false;

  readonly completado = this.servicio.completado;

  vistaPrevia: string[] = [];

  constructor() {
    this.vistaPrevia = [
      'Registra tus gastos en segundos',
      'Visualiza gráficos interactivos 3D',
      'Define metas de ahorro alcanzables',
      'Recibe recomendaciones personalizadas',
      'Exporta y comparte tus reportes',
    ];
  }

  siguiente(): void {
    if (this.paso < this.vistaPrevia.length) {
      this.paso++;
    } else {
      this.terminado = true;
    }
  }

  anterior(): void {
    if (this.paso > 1) this.paso--;
  }

  empezarCuestionario(): void {
    this.router.navigate(['/encuesta']);
  }

  saltar(): void {
    this.router.navigate(['/dashboard']);
  }
}