import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Libro, Categoria } from './libro.model';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-management.component.html'
})
export class BookManagementComponent {
  categorias: Categoria[] = [
    { id: 'GASTRONOMÍA', nombre: 'Gastronomía', descripcion: 'Recetas, técnicas culinarias y cocina internacional.', color: 'from-amber-500 to-orange-600' },
    { id: 'DISEÑO DE MODA', nombre: 'Diseño de Moda', descripcion: 'Tendencias, patronaje e historia de la indumentaria.', color: 'from-pink-500 to-rose-600' },
    { id: 'TECNOLOGÍA', nombre: 'Tecnología', descripcion: 'Programación, redes, IA y desarrollo de software.', color: 'from-cyan-500 to-blue-600' },
    { id: 'LITERATURA', nombre: 'Literatura', descripcion: 'Novelas, poesía, obras clásicas y contemporáneas.', color: 'from-purple-500 to-indigo-600' },
    { id: 'CIENCIA', nombre: 'Ciencia', descripcion: 'Física, biología, química y astronomía.', color: 'from-emerald-500 to-teal-600' },
    { id: 'HISTORIA', nombre: 'Historia', descripcion: 'Acontecimientos históricos, biografías y civilizaciones.', color: 'from-yellow-500 to-amber-700' }
  ];

  libros: Libro[] = [
    { id: 1, titulo: 'Gastronomía Peruana', autor: 'Gastón Acurio', categoria: 'GASTRONOMÍA', imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600', estado: 'Disponible' },
    { id: 2, titulo: 'Clean Code', autor: 'Robert C. Martin', categoria: 'TECNOLOGÍA', imagen: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600', estado: 'Disponible' }
  ];

  categoriaSeleccionada: Categoria | null = null;
  mostrarModal = false;
  busqueda = '';

  nuevoTitulo = '';
  nuevoAutor = '';
  nuevaCategoria = 'GASTRONOMÍA';
  nuevaImagen = '';

  // Propiedades faltantes para las métricas
  get totalDisponibles(): number {
    return this.libros.filter(l => l.estado === 'Disponible').length;
  }

  get totalPrestados(): number {
    return this.libros.filter(l => l.estado === 'Prestado').length;
  }

  get librosFiltrados(): Libro[] {
    return this.libros.filter(libro => {
      const coincideCategoria = this.categoriaSeleccionada ? libro.categoria === this.categoriaSeleccionada.id : true;
      const coincideBusqueda = libro.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                               libro.autor.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }

  seleccionarCategoria(cat: Categoria): void {
    this.categoriaSeleccionada = cat;
  }

  volverACategorias(): void {
    this.categoriaSeleccionada = null;
    this.busqueda = '';
  }

  obtenerCantidadLibros(categoriaId: string): number {
    return this.libros.filter(l => l.categoria === categoriaId).length;
  }

  guardarLibro(): void {
    if (this.nuevoTitulo && this.nuevoAutor && this.nuevaCategoria) {
      this.libros.unshift({
        id: Date.now(),
        titulo: this.nuevoTitulo,
        autor: this.nuevoAutor,
        categoria: this.nuevaCategoria,
        imagen: this.nuevaImagen || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600',
        estado: 'Disponible'
      });

      this.nuevoTitulo = '';
      this.nuevoAutor = '';
      this.nuevaImagen = '';
      this.mostrarModal = false;
    }
  }

  eliminarLibro(id: number): void {
    this.libros = this.libros.filter(l => l.id !== id);
  }

  alternarEstado(libro: Libro): void {
    libro.estado = libro.estado === 'Disponible' ? 'Prestado' : 'Disponible';
  }
}