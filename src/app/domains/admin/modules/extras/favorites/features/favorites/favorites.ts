import {
  ChangeDetectionStrategy,
  Component,
  Inject,
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
  search = '';

  selectedCategory = 'Todos';

  categories = [
    'Todos',
    'Diseño de Modas',
    'Desarrollo de Software',
    'Marketing Digital',
    'Arte Culinario',
  ];

  books = [
    // ==========================================
    // DISEÑO DE MODAS
    // ==========================================

    {
      title: 'Illustrating Fashion',
      author: 'Steven Stipelman',
      year: 1996,
      category: 'Diseño de Modas',
      isbn: '9780130806987',
      favorite: true,
    },

    {
      title: 'Fashion Design',
      author: 'Sue Jenkyn Jones',
      year: 2011,
      category: 'Diseño de Modas',
      isbn: '9780764147821',
      favorite: true,
    },

    // ==========================================
    // DESARROLLO DE SOFTWARE
    // ==========================================

    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 2008,
      category: 'Desarrollo de Software',
      isbn: '9780132350884',
      favorite: true,
    },

    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas y Andrew Hunt',
      year: 2019,
      category: 'Desarrollo de Software',
      isbn: '9780135957059',
      favorite: true,
    },

    {
      title: 'Design Patterns',
      author: 'Erich Gamma y otros',
      year: 1994,
      category: 'Desarrollo de Software',
      isbn: '9780201633610',
      favorite: true,
    },

    // ==========================================
    // MARKETING DIGITAL
    // ==========================================

    {
      title: 'Marketing Management',
      author: 'Philip Kotler',
      year: 2003,
      category: 'Marketing Digital',
      isbn: '9780131457577',
      favorite: true,
    },

    {
      title: 'Principles of Marketing',
      author: 'Philip Kotler y Gary Armstrong',
      year: 2010,
      category: 'Marketing Digital',
      isbn: '9780132167123',
      favorite: true,
    },

    {
      title: 'Contagious',
      author: 'Jonah Berger',
      year: 2013,
      category: 'Marketing Digital',
      isbn: '9781451686579',
      favorite: true,
    },

    // ==========================================
    // ARTE CULINARIO
    // ==========================================

    {
      title: 'Professional Cooking',
      author: 'Wayne Gisslen',
      year: 2007,
      category: 'Arte Culinario',
      isbn: '9780470299043',
      favorite: true,
    },

    {
      title: 'The Professional Chef',
      author: 'The Culinary Institute of America',
      year: 2011,
      category: 'Arte Culinario',
      isbn: '9780470421352',
      favorite: true,
    },
  ];

  constructor(private dialog: MatDialog) {}

  /**
   * Obtiene la portada del libro desde Open Library.
   */
  getCover(isbn: string): string {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  }

  /**
   * Libros filtrados por búsqueda y categoría.
   */
  get filteredBooks() {
    const search = this.search.toLowerCase().trim();

    return this.books.filter((book) => {
      const matchesCategory =
        this.selectedCategory === 'Todos' ||
        book.category === this.selectedCategory;

      const matchesSearch =
        !search ||
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  /**
   * Cambia la categoría seleccionada.
   */
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  /**
   * Agrega o quita un libro de favoritos.
   */
  toggleFavorite(book: { favorite: boolean }): void {
    book.favorite = !book.favorite;
  }

  /**
   * Abre la información del libro.
   */
  openBook(book: {
    title: string;
    author: string;
    year: number;
    category: string;
    isbn: string;
  }): void {
    this.dialog.open(BookDetailsDialog, {
      width: '500px',
      data: book,
    });
  }
}


/*
 * ==========================================
 * DIÁLOGO DE INFORMACIÓN DEL LIBRO
 * ==========================================
 */

@Component({
  selector: 'app-book-details-dialog',

  template: `
    <div class="p-6">

      <!-- Encabezado -->

      <div class="flex items-center justify-between">

        <h2 class="text-2xl font-bold text-gray-900">
          {{ data.title }}
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
          [src]="
            'https://covers.openlibrary.org/b/isbn/'
            + data.isbn
            + '-L.jpg'
          "
          [alt]="'Portada de ' + data.title"
          class="h-64 w-44 rounded-lg object-cover"
        />


        <!-- Datos -->

        <div>

          <p class="text-sm text-gray-500">
            Autor
          </p>

          <p class="font-medium text-gray-900">
            {{ data.author }}
          </p>


          <p class="mt-4 text-sm text-gray-500">
            Año
          </p>

          <p class="font-medium text-gray-900">
            {{ data.year }}
          </p>


          <p class="mt-4 text-sm text-gray-500">
            Categoría
          </p>

          <p class="font-medium text-gray-900">
            {{ data.category }}
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
      title: string;
      author: string;
      year: number;
      category: string;
      isbn: string;
    },
  ) {}
}