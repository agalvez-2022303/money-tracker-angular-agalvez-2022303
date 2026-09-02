import { Injectable, signal, computed } from '@angular/core';
import {
  RespuestaCuestionario,
  DatosPersonales,
  MetasFinancieras,
  DatosIngresosGastos,
  MetaAhorro,
} from '../models/cuestionario.model';

@Injectable({ providedIn: 'root' })
export class CuestionarioService {
  private static readonly CLAVE = 'cuestionario_financiero';

  private respuesta = signal<RespuestaCuestionario>(this.cargar() ?? this.vacia());

  readonly datos = this.respuesta.asReadonly();
  readonly completado = computed(() => this.respuesta().completado);

  guardarPersonales(datos: DatosPersonales): void {
    this.actualizar({ personales: datos });
  }

  guardarMetas(datos: MetasFinancieras): void {
    this.actualizar({ metas: datos });
  }

  guardarIngresos(datos: DatosIngresosGastos): void {
    this.actualizar({ ingresos: datos });
  }

  guardarAhorro(datos: MetaAhorro): void {
    this.actualizar({ ahorro: datos });
  }

  marcarCompletado(): void {
    this.actualizar({ completado: true });
  }

  reiniciar(): void {
    this.respuesta.set(this.vacia());
    this.persistir();
  }

  private actualizar(parcial: Partial<RespuestaCuestionario>): void {
    this.respuesta.update((actual) => ({ ...actual, ...parcial }));
    this.persistir();
  }

  private vacia(): RespuestaCuestionario {
    return {
      personales: {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        ocupacion: 'empleado',
      },
      metas: {
        metaPrincipal: '',
        plazo: 'corto',
        perfilRiesgo: 'moderado',
        sabe_Ahorrar: false,
        llevaPresupuesto: false,
      },
      ingresos: {
        ingresoMensual: 0,
        gastoFijoMensual: 0,
        gastoVariableMensual: 0,
        gastoEntretenimiento: 0,
        deudas: 0,
        dependientes: 0,
      },
      ahorro: {
        tenerMetaAhorro: false,
        nombreMeta: '',
        montoObjetivo: 0,
        ahorroActual: 0,
        aporteMensual: 0,
        moneda: 'GTQ',
        razonesAhorro: [],
      },
      completado: false,
    };
  }

  private cargar(): RespuestaCuestionario | null {
    const guardado = localStorage.getItem(CuestionarioService.CLAVE);
    if (!guardado) return null;
    try {
      return JSON.parse(guardado) as RespuestaCuestionario;
    } catch {
      return null;
    }
  }

  private persistir(): void {
    localStorage.setItem(
      CuestionarioService.CLAVE,
      JSON.stringify(this.respuesta())
    );
  }
}
