export interface Libro {
  id: string;
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