import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface CategoryBook {
	title: string;
	author: string;
	format: string;
	year: number;
}

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
export class MyComponent {
	categories = signal([
		'Investigación Yavirac',
		'Diseño de Modas',
		'Libros Físicos',
		'Idiomas',
		'Desarrollo de Software',
		'Repositorio de los trabajos de titulación',
		'Marketing',
		'Arte Culinario',
		'Guía Nacional de Turismo',
	]);

	books: Record<string, CategoryBook[]> = {
		'Investigación Yavirac': [
			{
				title: 'Investigación Aplicada en Tecnología',
				author: 'Instituto Yavirac',
				format: 'PDF',
				year: 2024,
			},
		],
		'Diseño de Modas': [
			{
				title: 'Illustrating Fashion',
				author: 'Steven Stipelman',
				format: 'PDF',
				year: 1996,
			},
		],
		'Desarrollo de Software': [
			{
				title: 'Programación Web con Angular',
				author: 'Luis Andrade',
				format: 'PDF',
				year: 2025,
			},
		],
	};

	selectedCategory = signal<string | null>(null);

	showForm = signal(false);
	newCategoryName = signal('');
	newCategoryDescription = signal('');

	filteredBooks = computed(() => {
		const category = this.selectedCategory();
		return category ? (this.books[category] ?? []) : [];
	});

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

		this.categories.update((categories) => [...categories, name]);
		this.cancelForm();
	}

	goToCategory(category: string): void {
		this.selectedCategory.set(category);
	}

	volver(): void {
		this.selectedCategory.set(null);
	}
}
