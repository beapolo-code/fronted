import {
  Component,
  OnInit,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Libro } from '../book-management/libro.model';
import { LibroService } from '../book-management/libro.service';
import { Video, VideosService } from '../videos/videos.service';

interface LibroInicio {
  id: string;
  posicion?: number;
  titulo: string;
  autor: string;
  categoria: string;
  portada: string;
}

interface VideoInicio {
  titulo: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  @ViewChild('contenedorLibros')
  contenedorLibros!: ElementRef;
  @ViewChild('contenedorRecientes')
  contenedorRecientes!: ElementRef;
  @ViewChild('contenedorVideos')
  contenedorVideos!: ElementRef;

  private libroService = inject(LibroService);
  private videosService = inject(VideosService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  librosMasLeidos: LibroInicio[] = [];
  librosRecientes: LibroInicio[] = [];
  videos: VideoInicio[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarLibros();
      this.cargarVideos();
    }
  }

  private cargarLibros(): void {
    this.libroService.obtenerLibros().subscribe({
      next: (libros: Libro[]) => {
        this.librosMasLeidos = libros
          .slice(0, 10)
          .map((l, i) => ({
            id: l.id,
            posicion: i + 1,
            titulo: l.titulo,
            autor: l.autor,
            categoria: l.categoria,
            portada: l.imagen || this.portadaPorDefecto(),
          }));
        this.librosRecientes = libros.slice(0, 10).map((l) => ({
          id: l.id,
          titulo: l.titulo,
          autor: l.autor,
          categoria: l.categoria,
          portada: l.imagen || this.portadaPorDefecto(),
        }));
      },
      error: (err) => console.error('Error al cargar libros inicio:', err),
    });
  }

  private cargarVideos(): void {
    this.videosService.findAll().then((videos: Video[]) => {
      this.videos = videos.slice(0, 10).map((v) => ({
        titulo: v.title,
        descripcion: v.description ?? '',
        imagen: v.thumbnailUrl || this.portadaPorDefecto(),
      }));
    }).catch((err) =>
      console.error('Error al cargar videos inicio:', err),
    );
  }

  private portadaPorDefecto(): string {
    return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80';
  }

  desplazarLibros(direccion: number): void {
    this.contenedorLibros.nativeElement.scrollBy({
      left: direccion * 400,
      behavior: 'smooth',
    });
  }

  desplazarRecientes(direccion: number): void {
    this.contenedorRecientes.nativeElement.scrollBy({
      left: direccion * 400,
      behavior: 'smooth',
    });
  }

  desplazarVideos(direccion: number): void {
    this.contenedorVideos.nativeElement.scrollBy({
      left: direccion * 400,
      behavior: 'smooth',
    });
  }

  irACategoria(categoria: string): void {
    this.router.navigate([
      '/admin/libros-categoria',
      encodeURIComponent(categoria || 'General'),
    ]);
  }
}