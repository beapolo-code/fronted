import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FavoritesService } from './favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
  ],
})
export default class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly dialog = inject(MatDialog);

  search = '';

  selectedCategory = 'Todos';

  categories = ['Todos'];

  books: {
    id: string;
    titulo: string;
    autor: string;
    categoria: string;
    imagen: string;
  }[] = [];

  loading = true;

  constructor() {
    this.loadFavorites();
  }

  async loadFavorites(): Promise<void> {
    this.loading = true;
    try {
      const favoritos = await this.favoritesService.findAll();
      this.books = favoritos.map((favorito) => ({
        id: favorito.bookId,
        titulo: favorito.titulo,
        autor: favorito.autor,
        categoria: favorito.categoria,
        imagen: favorito.imagen,
      }));

      const set = new Set<string>();
      this.categories = ['Todos'];
      for (const book of this.books) {
        if (book.categoria && !set.has(book.categoria)) {
          set.add(book.categoria);
          this.categories.push(book.categoria);
        }
      }
    } finally {
      this.loading = false;
    }
  }

  getCover(id: string, imagen: string): string {
    return imagen || `https://covers.openlibrary.org/b/isbn/${id}-L.jpg`;
  }

  get filteredBooks() {
    const search = this.search.toLowerCase().trim();

    return this.books.filter((book) => {
      const matchesCategory =
        this.selectedCategory === 'Todos' ||
        book.categoria === this.selectedCategory;

      const matchesSearch =
        !search ||
        book.titulo.toLowerCase().includes(search) ||
        book.autor.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  async toggleFavorite(book: { id: string }): Promise<void> {
    await this.favoritesService.toggle(book.id);
    await this.loadFavorites();
  }

  openBook(book: {
    titulo: string;
    autor: string;
    categoria: string;
    imagen: string;
  }): void {
    this.dialog.open(BookDetailsDialog, {
      width: '500px',
      data: book,
    });
  }
}

@Component({
  selector: 'app-book-details-dialog',

  template: `
    <div class="bg-slate-900 p-6 text-white">

      <!-- Encabezado -->

      <div class="flex items-center justify-between">

        <h2 class="text-2xl font-bold text-white">
          {{ data.titulo }}
        </h2>

        <button
          mat-icon-button
          mat-dialog-close
          aria-label="Cerrar"
        >
          <mat-icon>
            close
          </mat-icon>
        </button>

      </div>


      <!-- Información -->

      <div class="mt-6 flex gap-5">

        <!-- Portada -->

        <img
          [src]="data.imagen"
          [alt]="'Portada de ' + data.titulo"
          class="h-64 w-44 rounded-lg object-cover"
        />


        <!-- Datos -->

        <div>

          <p class="text-sm text-slate-400">
            Autor
          </p>

          <p class="font-medium text-white">
            {{ data.autor }}
          </p>


          <p class="mt-4 text-sm text-slate-400">
            Categoría
          </p>

          <p class="font-medium text-white">
            {{ data.categoria }}
          </p>

        </div>

      </div>


      <!-- Botón cerrar -->

      <div class="mt-6 flex justify-end">

        <button
          mat-flat-button
          color="primary"
          mat-dialog-close
        >
          Cerrar
        </button>

      </div>

    </div>
  `,

  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      autor: string;
      categoria: string;
      imagen: string;
    },
  ) {}
}