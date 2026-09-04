import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Libro, Categoria } from './libro.model';
import { LibroService } from './libro.service';
import { CategoriaService } from '../my-component/categoria.service';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-management.component.html'
})
export class BookManagementComponent implements OnInit {
  private libroService = inject(LibroService);
  private categoriaService = inject(CategoriaService);
  private platformId = inject(PLATFORM_ID);

  private readonly gradientes = [
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-yellow-500 to-amber-700',
    'from-sky-500 to-indigo-600',
    'from-lime-500 to-green-600',
    'from-fuchsia-500 to-purple-600'
  ];

  categorias: Categoria[] = [];

  libros: Libro[] = [];
  cargando = false;

  categoriaSeleccionada: Categoria | null = null;
  mostrarModal = false;
  busqueda = '';

  nuevoTitulo = '';
  nuevoAutor = '';
  nuevaCategoria = '';
  nuevaImagen = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarLibros();
      this.cargarCategorias();
    }
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats.map((c, i) => ({
          id: c.nombre,
          nombre: c.nombre,
          descripcion: c.descripcion,
          color: this.gradientes[i % this.gradientes.length]
        }));
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  cargarLibros(): void {
    this.cargando = true;
    this.libroService.obtenerLibros().subscribe({
      next: (datos) => {
        this.libros = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al consultar NestJS:', err);
        this.cargando = false;
      }
    });
  }

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
      const payload: Omit<Libro, 'id'> = {
        titulo: this.nuevoTitulo,
        autor: this.nuevoAutor,
        categoria: this.nuevaCategoria,
        imagen: this.nuevaImagen || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600',
        estado: 'Disponible'
      };

      this.libroService.crearLibro(payload).subscribe({
        next: () => {
          this.nuevoTitulo = '';
          this.nuevoAutor = '';
          this.nuevaImagen = '';
          this.mostrarModal = false;
          this.cargarLibros();
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  eliminarLibro(id: number | string): void {
    this.libroService.eliminarLibro(id).subscribe({
      next: () => {
        this.cargarLibros();
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  alternarEstado(libro: Libro): void {
    const nuevoEstado = libro.estado === 'Disponible' ? 'Prestado' : 'Disponible';

    this.libroService.actualizarEstado(libro.id!, nuevoEstado).subscribe({
      next: (actualizado) => {
        libro.estado = actualizado.estado;
      },
      error: () => {
        // Alternado reactivo local en caso de fallback
        libro.estado = nuevoEstado;
      }
    });
  }
}