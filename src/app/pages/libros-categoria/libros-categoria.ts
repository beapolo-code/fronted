import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Libro } from '../book-management/libro.model';
import { LibroService } from '../book-management/libro.service';

interface BookItem {
	title: string;
	author: string;
	category: string;
	year?: number;
	format?: string;
}

@Component({
	selector: 'app-libros-categoria',
	imports: [MatIconModule, MatButtonModule],
	templateUrl: './libros-categoria.html',
})
export class LibrosCategoria implements OnInit {
	private libroService = inject(LibroService);
	private platformId = inject(PLATFORM_ID);

	categoria = signal('');

	books = signal<BookItem[]>([]);

	constructor(
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.route.paramMap.subscribe((params) => {
			this.categoria.set(params.get('categoria') ?? '');
		});
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.cargarLibros();
		}
	}

	private cargarLibros(): void {
		this.libroService.obtenerLibros().subscribe({
			next: (libros: Libro[]) => {
				this.books.set(this.mapear(libros));
			},
			error: (err) => console.error('Error al cargar libros:', err),
		});
	}

	private mapear(libros: Libro[]): BookItem[] {
		return libros.map((l) => ({
			title: l.titulo,
			author: l.autor,
			category: l.categoria,
		}));
	}

	get filteredBooks() {
		const cat = this.categoria();
		if (!cat || cat.toLowerCase() === 'general') {
			return this.books();
		}
		return this.books().filter((book) => book.category === cat);
	}

	volver() {
		this.router.navigate(['/admin/mi-componente']);
	}
}