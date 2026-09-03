import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface Video {
  id: number;
  titulo: string;
  duracion: string;
  categoria: string;
  miniatura: string;
}

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './videos.html' // Cambiar a './videos.component.html' si su HTML tiene ese nombre
})
export class VideosComponent {
  textoBusqueda: string = '';
  categoriaSeleccionada: string = 'todos';

  videos: Video[] = [
    {
      id: 1,
      titulo: 'Curso Completo de Angular y Tailwind CSS',
      duracion: '15:20',
      categoria: 'programacion',
      miniatura: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 2,
      titulo: 'Introducción a Docker y Kubernetes para Principiantes',
      duracion: '22:45',
      categoria: 'devops',
      miniatura: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 3,
      titulo: 'Modelado de Bases de Datos Relacionales con PostgreSQL',
      duracion: '18:10',
      categoria: 'base-datos',
      miniatura: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 4,
      titulo: 'Principios de UI/UX Design para Desarrolladores Web',
      duracion: '12:05',
      categoria: 'diseno',
      miniatura: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=400&auto=format&fit=crop'
    }
  ];

  get videosFiltrados(): Video[] {
    return this.videos.filter(video => {
      const coincideTexto = video.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === 'todos' || video.categoria === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }
}