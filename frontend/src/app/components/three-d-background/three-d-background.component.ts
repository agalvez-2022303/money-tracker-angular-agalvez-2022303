import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-d-background',
  standalone: true,
  template: '<div #contenedor class="three-d-background" aria-hidden="true"></div>',
  styles: [
    `
      :host { display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
      .three-d-background { position: absolute; inset: 0; overflow: hidden; }
      :host ::ng-deep canvas { display: block; width: 100%; height: 100%; }
    `,
  ],
})
export class ThreeDBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('contenedor', { static: true }) contenedor!: ElementRef<HTMLDivElement>;

  readonly densidad = input<number>(18);
  readonly colores = input<string[]>(['#22C55E', '#16a34a', '#4ade80', '#10b981']);
  readonly suavizado = input<boolean>(true);

  private renderizador!: THREE.WebGLRenderer;
  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private formas: THREE.Mesh[] = [];
  private animacionId = 0;

  ngOnInit(): void {
    this.inicializarEscena();
    this.crearFormas();
    this.animar();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animacionId);
    this.formas.forEach((forma) => {
      forma.geometry.dispose();
      (forma.material as THREE.Material).dispose();
    });
    this.renderizador.dispose();
  }

  private inicializarEscena(): void {
    const contenedor = this.contenedor.nativeElement;
    const ancho = contenedor.clientWidth || window.innerWidth;
    const alto = contenedor.clientHeight || window.innerHeight;

    this.escena = new THREE.Scene();

    this.camara = new THREE.PerspectiveCamera(55, ancho / alto, 0.1, 1000);
    this.camara.position.z = 30;

    this.renderizador = new THREE.WebGLRenderer({ antialias: this.suavizado(), alpha: true });
    this.renderizador.setSize(ancho, alto);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(this.renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    this.escena.add(luzAmbiente);

    const luzDireccional = new THREE.DirectionalLight(0x22c55e, 1.2);
    luzDireccional.position.set(10, 20, 30);
    this.escena.add(luzDireccional);

    const luzPunto = new THREE.PointLight(0x4ade80, 0.8);
    luzPunto.position.set(-15, -10, 15);
    this.escena.add(luzPunto);
  }

  private crearFormas(): void {
    const colores = this.colores();
    const geometrias = [
      () => new THREE.BoxGeometry(2.2, 2.2, 2.2),
      () => new THREE.SphereGeometry(1.4, 24, 24),
      () => new THREE.ConeGeometry(1.4, 2.6, 24),
      () => new THREE.TorusGeometry(1.2, 0.45, 16, 40),
      () => new THREE.IcosahedronGeometry(1.5, 0),
      () => new THREE.OctahedronGeometry(1.5, 0),
    ];

    for (let i = 0; i < this.densidad(); i++) {
      const geo = geometrias[Math.floor(Math.random() * geometrias.length)]();
      const material = new THREE.MeshStandardMaterial({
        color: colores[Math.floor(Math.random() * colores.length)],
        transparent: true,
        opacity: 0.6 + Math.random() * 0.35,
        roughness: 0.35,
        metalness: 0.35,
        wireframe: Math.random() > 0.7,
      });
      const forma = new THREE.Mesh(geo, material);
      forma.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 20
      );
      forma.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.escena.add(forma);
      this.formas.push(forma);
    }
  }

  private animar = (): void => {
    this.animacionId = requestAnimationFrame(this.animar);
    const tiempo = Date.now() * 0.0004;
    this.formas.forEach((forma, i) => {
      forma.rotation.x += 0.002 + i * 0.0001;
      forma.rotation.y += 0.003;
      forma.position.y += Math.sin(tiempo + i) * 0.008;
    });
    this.renderizador.render(this.escena, this.camara);
  };
}
