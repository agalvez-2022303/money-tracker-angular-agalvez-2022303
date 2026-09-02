import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatosPersonales, Ocupacion } from '../../models/cuestionario.model';
import { CuestionarioService } from '../../services/cuestionario.service';

@Component({
  selector: 'app-cuestionario-paso-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuestionario-paso-personal.component.html',
  styleUrls: ['./cuestionario-paso-personal.component.css'],
})
export class CuestionarioPasoPersonalComponent {
  private servicio = inject(CuestionarioService);

  readonly continuar = output<DatosPersonales>();
  readonly volver = output<void>();

  nombre = '';
  apellido = '';
  email = '';
  telefono = '';
  fechaNacimiento = '';
  ocupacion: Ocupacion = 'empleado';

  ocupaciones: { valor: Ocupacion; etiqueta: string }[] = [
    { valor: 'empleado', etiqueta: 'Empleado/a' },
    { valor: 'independiente', etiqueta: 'Independiente / Freelance' },
    { valor: 'estudiante', etiqueta: 'Estudiante' },
    { valor: 'negocio', etiqueta: 'Dueño de negocio' },
    { valor: 'jubilado', etiqueta: 'Jubilado/a' },
    { valor: 'otro', etiqueta: 'Otro' },
  ];

  error = '';

  constructor() {
    const previo = this.servicio.datos().personales;
    this.nombre = previo.nombre;
    this.apellido = previo.apellido;
    this.email = previo.email;
    this.telefono = previo.telefono;
    this.fechaNacimiento = previo.fechaNacimiento;
    this.ocupacion = previo.ocupacion;
  }

  onContinuar(): void {
    if (!this.nombre.trim() || !this.apellido.trim() || !this.email.trim()) {
      this.error = 'Por favor completa los campos obligatorios (nombre, apellido y email).';
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = 'El email no tiene un formato válido.';
      return;
    }
    this.error = '';
    this.continuar.emit({
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      email: this.email.trim(),
      telefono: this.telefono.trim(),
      fechaNacimiento: this.fechaNacimiento,
      ocupacion: this.ocupacion,
    });
  }
}
