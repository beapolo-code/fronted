import {
  Component,
  signal,
  PLATFORM_ID,
  OnInit,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaService } from './categoria.service';

@Component({
	selector: 'app-my-component',
	imports: [
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './my-component.html',
})
export class MyComponent implements OnInit {
	private categoriaService = inject(CategoriaService);
	private platformId = inject(PLATFORM_ID);
	private router = inject(Router);

	categories = signal<string[]>([]);

	showForm = signal(false);
	newCategoryName = signal('');
	newCategoryDescription = signal('');

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.cargarCategorias();
		}
	}

	private cargarCategorias(): void {
		this.categoriaService.obtenerCategorias().subscribe({
			next: (cats) => {
				this.categories.set(cats.map((c) => c.nombre));
			},
			error: (err) => console.error('Error al cargar categorías:', err),
		});
	}

	openForm(): void {
		this.showForm.set(true);
	}

	cancelForm(): void {
		this.showForm.set(false);
		this.newCategoryName.set('');
		this.newCategoryDescription.set('');
	}

	addCategory(): void {
		const name = this.newCategoryName().trim();

		if (!name) {
			return;
		}

		this.categoriaService
			.crearCategoria({
				nombre: name,
				descripcion: this.newCategoryDescription().trim() || undefined,
			})
			.subscribe({
				next: () => {
					this.cancelForm();
					this.cargarCategorias();
				},
				error: (err) => console.error('Error al crear categoría:', err),
			});
	}

	goToCategory(category: string): void {
		this.router.navigate(['/admin/libros-categoria', encodeURIComponent(category)]);
	}
}