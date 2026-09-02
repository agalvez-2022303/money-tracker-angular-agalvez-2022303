import { Component, input } from '@angular/core';
import { ThreeDCubeComponent } from '../three-d-cube/three-d-cube.component';

@Component({
  selector: 'app-dashboard-hero-3d',
  standalone: true,
  imports: [ThreeDCubeComponent],
  template: `
    <div class="hero-3d" aria-hidden="true">
      <div class="hero-3d__cubo">
        <app-three-d-cube></app-three-d-cube>
      </div>
      <div class="hero-3d__anillo hero-3d__anillo--1"></div>
      <div class="hero-3d__anillo hero-3d__anillo--2"></div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .hero-3d { position: relative; width: 120px; height: 120px; }
      .hero-3d__cubo { position: absolute; inset: 10px; }
      .hero-3d__anillo {
        position: absolute; border-radius: 50%;
        border: 1px solid rgba(34,197,94,0.15);
        pointer-events: none;
      }
      .hero-3d__anillo--1 { inset: -15px; animation: girar3d 14s linear infinite; border-style: dashed; }
      .hero-3d__anillo--2 { inset: -30px; animation: girar3d 22s linear infinite reverse; border-color: rgba(34,197,94,0.08); }
      @keyframes girar3d {
        0% { transform: rotate(0deg) rotateY(0deg); }
        100% { transform: rotate(360deg) rotateY(50deg); }
      }
    `,
  ],
})
export class DashboardHero3DComponent {}