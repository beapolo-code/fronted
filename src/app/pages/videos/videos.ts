import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
    DomSanitizer,
    SafeResourceUrl
} from '@angular/platform-browser';
import { Video, VideosService } from './videos.service';

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
    templateUrl: './videos.html'
})
export class VideosComponent implements OnInit {

    private readonly videosService = inject(VideosService);
    private readonly sanitizer = inject(DomSanitizer);

    textoBusqueda = '';
    categoriaSeleccionada = 'todos';
    videoSeleccionado: Video | null = null;

    cargando = false;
    mensajeError = '';

    // Formulario
    mostrarFormulario = false;
    videoEnEdicion: Video | null = null;
    nuevoTitulo = '';
    nuevaDescripcion = '';
    nuevaCategoria = '';
    nuevoVideoId = '';

    videos: Video[] = [];

    ngOnInit(): void {
        this.cargarVideos();
    }

    get videosFiltrados(): Video[] {
        const texto = this.textoBusqueda
            .trim()
            .toLowerCase();

        return this.videos.filter((video: Video) => {
            const coincideTexto =
                video.title.toLowerCase().includes(texto) ||
                (video.description ?? '')
                    .toLowerCase()
                    .includes(texto);

            const coincideCategoria =
                this.categoriaSeleccionada === 'todos' ||
                video.category === this.categoriaSeleccionada;

            return coincideTexto && coincideCategoria;
        });
    }

    async cargarVideos(): Promise<void> {
        this.cargando = true;
        this.mensajeError = '';

        try {
            this.videos = await this.videosService.findAll();
        } catch {
            this.mensajeError =
                'No se pudieron cargar los videos del servidor.';
        } finally {
            this.cargando = false;
        }
    }

    abrirFormulario(): void {
        this.videoEnEdicion = null;
        this.mostrarFormulario = true;
        this.mensajeError = '';
        this.nuevoTitulo = '';
        this.nuevaDescripcion = '';
        this.nuevaCategoria = '';
        this.nuevoVideoId = '';
    }

    abrirEdicion(video: Video): void {
        this.videoEnEdicion = video;
        this.mostrarFormulario = true;
        this.mensajeError = '';
        this.nuevoTitulo = video.title;
        this.nuevaDescripcion = video.description ?? '';
        this.nuevaCategoria = video.category;
        this.nuevoVideoId = video.videoId;
    }

    cerrarFormulario(): void {
        this.mostrarFormulario = false;
        this.videoEnEdicion = null;
        this.limpiarFormulario();
    }

    async guardarVideo(): Promise<void> {
        this.mensajeError = '';

        if (!this.nuevoTitulo.trim()) {
            this.mensajeError =
                'Debes escribir el título del video.';
            return;
        }

        if (!this.nuevoVideoId.trim()) {
            this.mensajeError =
                'Debes escribir el ID o la URL del video.';
            return;
        }

        if (!this.nuevaCategoria) {
            this.mensajeError =
                'Debes seleccionar una categoría.';
            return;
        }

        const payload = {
            title: this.nuevoTitulo.trim(),
            videoId: this.nuevoVideoId.trim(),
            category: this.nuevaCategoria,
            description:
                this.nuevaDescripcion.trim() || null,
            thumbnailUrl: null
        };

        try {
            if (this.videoEnEdicion) {
                await this.videosService.update(
                    this.videoEnEdicion.id,
                    payload
                );
            } else {
                await this.videosService.create(payload);
            }

            this.cerrarFormulario();
            await this.cargarVideos();
        } catch {
            this.mensajeError =
                'No se pudo guardar el video. Verifica la conexión.';
        }
    }

    async eliminarVideo(video: Video): Promise<void> {
        const confirmado = window.confirm(
            `¿Seguro que deseas eliminar "${video.title}"?`
        );

        if (!confirmado) {
            return;
        }

        if (this.videoSeleccionado?.id === video.id) {
            this.videoSeleccionado = null;
        }

        try {
            await this.videosService.remove(video.id);
            await this.cargarVideos();
        } catch {
            this.mensajeError =
                'No se pudo eliminar el video.';
        }
    }

    reproducirVideo(video: Video): void {
        this.videoSeleccionado = video;

        setTimeout(() => {
            document
                .getElementById('reproductor')
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
        });
    }

    cerrarVideo(): void {
        this.videoSeleccionado = null;
    }

    limpiarFiltros(): void {
        this.textoBusqueda = '';
        this.categoriaSeleccionada = 'todos';
    }

    limpiarFormulario(): void {
        this.nuevoTitulo = '';
        this.nuevaDescripcion = '';
        this.nuevaCategoria = '';
        this.nuevoVideoId = '';
    }

    obtenerUrlReproduccion(video: Video): string {
        const id = this.extraerProveedorId(video.videoId);

        if (this.esYoutube(video.videoId)) {
            return `https://www.youtube.com/embed/${id}`;
        }

        if (this.esVimeo(video.videoId)) {
            return `https://player.vimeo.com/video/${id}`;
        }

        return video.videoId;
    }

    obtenerUrlSegura(video: Video): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            this.obtenerUrlReproduccion(video)
        );
    }

    private esYoutube(valor: string): boolean {
        return (
            valor.includes('youtube') ||
            valor.includes('youtu.be')
        );
    }

    private esVimeo(valor: string): boolean {
        return valor.includes('vimeo');
    }

    private extraerProveedorId(valor: string): string {
        const coincidencia = valor.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/|youtube\.com\/embed\/)([\w-]+)/
        );

        if (coincidencia) {
            return coincidencia[1];
        }

        return valor;
    }

    formatearDuracion(segundos: number | null): string {
        if (
            segundos === null ||
            segundos === undefined ||
            !Number.isFinite(segundos) ||
            segundos < 0
        ) {
            return '—';
        }

        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor(
            (segundos % 3600) / 60
        );
        const secs = Math.floor(segundos % 60);

        if (horas > 0) {
            return `${this.pad(horas)}:${this.pad(
                minutos
            )}:${this.pad(secs)}`;
        }

        return `${this.pad(minutos)}:${this.pad(secs)}`;
    }

    private pad(valor: number): string {
        return valor.toString().padStart(2, '0');
    }
}