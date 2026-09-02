import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-d-coins',
  standalone: true,
  template: '<div #contenedor class="three-d-coins" aria-hidden="true"></div>',
  styles: [
    `
      :host { display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
      .three-d-coins { position: absolute; inset: 0; }
      :host ::ng-deep canvas { display: block; width: 100%; height: 100%; }
    `,
  ],
})
export class ThreeDCoinsComponent implements OnInit, OnDestroy {
  @ViewChild('contenedor', { static: true }) contenedor!: ElementRef<HTMLDivElement>;

  private renderizador!: THREE.WebGLRenderer;
  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private monedas: THREE.Mesh[] = [];
  private animacionId = 0;

  ngOnInit(): void {
    this.inicializar();
    this.animar();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animacionId);
    this.monedas.forEach((m) => {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    this.renderizador.dispose();
  }

  private inicializar(): void {
    const contenedor = this.contenedor.nativeElement;
    const ancho = contenedor.clientWidth || window.innerWidth;
    const alto = contenedor.clientHeight || window.innerHeight;

    this.escena = new THREE.Scene();
    this.camara = new THREE.PerspectiveCamera(50, ancho / alto, 0.1, 1000);
    this.camara.position.z = 28;

    this.renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderizador.setSize(ancho, alto);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(this.renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.7);
    this.escena.add(luzAmbiente);
    const luz1 = new THREE.DirectionalLight(0x22c55e, 1.2);
    luz1.position.set(10, 15, 25);
    this.escena.add(luz1);
    const luz2 = new THREE.PointLight(0x4ade80, 0.6);
    luz2.position.set(-15, -8, 10);
    this.escena.add(luz2);

    const colores = [0xf7931a, 0x627eea, 0x9945ff, 0x22c55e, 0x16a34a];
    const rayas = ['₿', 'Ξ', '◎', 'Q', '₴'];

    for (let i = 0; i < 9; i++) {
      const radio = 0.6 + Math.random() * 0.9;
      const geometria = new THREE.CylinderGeometry(radio, radio, 0.18, 32);
      const color = colores[i % colores.length];
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.7,
        roughness: 0.4,
        transparent: true,
        opacity: 0.75,
      });
      const moneda = new THREE.Mesh(geometria, material);
      moneda.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 16
      );
      moneda.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.escena.add(moneda);
      this.monedas.push(moneda);
    }
  }

  private animar = (): void => {
    this.animacionId = requestAnimationFrame(this.animar);
    const t = Date.now() * 0.0006;
    this.monedas.forEach((moneda, i) => {
      moneda.rotation.x += 0.004;
      moneda.rotation.z += 0.006;
      moneda.position.y += Math.sin(t + i * 1.4) * 0.012;
    });
    this.renderizador.render(this.escena, this.camara);
  };
}