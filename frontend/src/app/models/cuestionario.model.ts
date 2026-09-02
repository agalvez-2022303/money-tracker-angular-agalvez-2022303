export type PerfilRiesgo = 'conservador' | 'moderado' | 'agresivo';

export type Ocupacion =
  | 'empleado'
  | 'independiente'
  | 'estudiante'
  | 'negocio'
  | 'jubilado'
  | 'otro';

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  ocupacion: Ocupacion;
}

export interface MetasFinancieras {
  metaPrincipal: string;
  plazo: 'corto' | 'mediano' | 'largo';
  perfilRiesgo: PerfilRiesgo;
  sabe_Ahorrar: boolean;
  llevaPresupuesto: boolean;
}

export interface DatosIngresosGastos {
  ingresoMensual: number;
  gastoFijoMensual: number;
  gastoVariableMensual: number;
  gastoEntretenimiento: number;
  deudas: number;
  dependientes: number;
}

export interface MetaAhorro {
  tenerMetaAhorro: boolean;
  nombreMeta: string;
  montoObjetivo: number;
  ahorroActual: number;
  aporteMensual: number;
  moneda: string;
  razonesAhorro: string[];
}

export interface RespuestaCuestionario {
  personales: DatosPersonales;
  metas: MetasFinancieras;
  ingresos: DatosIngresosGastos;
  ahorro: MetaAhorro;
  completado: boolean;
}
