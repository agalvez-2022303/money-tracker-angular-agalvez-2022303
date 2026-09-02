export interface CategoriaGasto {
  nombre: string;
  monto: number;
  color: string;
}

export interface DatosDona {
  total: number;
  categorias: CategoriaGasto[];
}