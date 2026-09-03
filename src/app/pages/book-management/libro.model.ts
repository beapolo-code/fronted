export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  imagen: string;
  estado: 'Disponible' | 'Prestado';
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
}