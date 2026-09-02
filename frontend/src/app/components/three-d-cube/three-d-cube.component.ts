import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-d-cube',
  standalone: true,
  template: '<div #contenedor class="three-d-cube" aria-hidden="true"></div>',
  styles: [
    `
      :host { display: block; width: 100%; height: 100%; }
      .three-d-cube { width: 100%; height: 100%; }
      :host ::ng-deep canvas { display: block; width: 100%; height: 100%; }
    `,
  ],
})
export class ThreeDCubeComponent implements OnInit, OnDestroy {
  @ViewChild('contenedor', { static: true }) contenedor!: ElementRef<HTMLDivElement>;

  private renderizador!: THREE.WebGLRenderer;
  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private cubo!: THREE.Mesh;
  private anillos: THREE.Mesh[] = [];
  private animacionId = 0;

  ngOnInit(): void {
    this.inicializar();
    this.animar();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animacionId);
    this.cubo.geometry.dispose();
    (this.cubo.material as THREE.Material).dispose();
    this.anillos.forEach((a) => {
      a.geometry.dispose();
      (a.material as THREE.Material).dispose();
    });
    this.renderizador.dispose();
  }

  private inicializar(): void {
    const contenedor = this.contenedor.nativeElement;
    const ancho = contenedor.clientWidth || 320;
    const alto = contenedor.clientHeight || 320;

    this.escena = new THREE.Scene();
    this.camara = new THREE.PerspectiveCamera(45, ancho / alto, 0.1, 100);
    this.camara.position.z = 7;

    this.renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderizador.setSize(ancho, alto);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(this.renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    this.escena.add(luzAmbiente);

    const luzPrincipal = new THREE.DirectionalLight(0x22c55e, 1.4);
    luzPrincipal.position.set(5, 8, 10);
    this.escena.add(luzPrincipal);

    const luzBorde = new THREE.PointLight(0x4ade80, 1);
    luzBorde.position.set(-5, -3, 5);
    this.escena.add(luzBorde);

    const geometriaCubo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const materialCubo = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.25,
      metalness: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    this.cubo = new THREE.Mesh(geometriaCubo, materialCubo);
    this.escena.add(this.cubo);

    const geometriaBorde = new THREE.EdgesGeometry(geometriaCubo);
    const materialBorde = new THREE.LineBasicMaterial({ color: 0x4ade80 });
    const borde = new THREE.LineSegments(geometriaBorde, materialBorde);
    this.cubo.add(borde);

    const geometriaAnillo = new THREE.TorusGeometry(2.6, 0.05, 12, 60);
    const materialAnillo = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.35,
    });
    const anillo1 = new THREE.Mesh(geometriaAnillo, materialAnillo);
    const anillo2 = new THREE.Mesh(geometriaAnillo, materialAnillo);
    const anillo3 = new THREE.Mesh(geometriaAnillo, materialAnillo);
    anillo2.material = materialAnillo.clone();
    anillo3.material = materialAnillo.clone();
    this.anillos = [anillo1, anillo2, anillo3];
    this.escena.add(anillo1, anillo2, anillo3);
  }

  private animar = (): void => {
    this.animacionId = requestAnimationFrame(this.animar);
    this.cubo.rotation.x += 0.006;
    this.cubo.rotation.y += 0.009;
    const t = Date.now() * 0.0008;
    this.cubo.position.y = Math.sin(t) * 0.3;

    this.anillos.forEach((anillo, i) => {
      anillo.rotation.x = Date.now() * 0.0003 * (i + 1) * 0.4;
      anillo.rotation.y = Date.now() * 0.0004 * (i + 1) * 0.4;
    });

    this.renderizador.render(this.escena, this.camara);
  };
}
