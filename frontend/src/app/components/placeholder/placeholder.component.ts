import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.css'],
})
export class PlaceholderComponent implements OnInit {
  readonly titulo = input<string>('Sección');
  readonly descripcion = input<string>('Esta sección estará disponible próximamente.');

  tituloMostrado = '';
  descripcionMostrada = '';

  constructor(private ruta: ActivatedRoute) {}

  ngOnInit(): void {
    const datos = this.ruta.snapshot.data;
    this.tituloMostrado = (datos['titulo'] as string) ?? this.titulo();
    this.descripcionMostrada = (datos['descripcion'] as string) ?? this.descripcion();
  }
}
