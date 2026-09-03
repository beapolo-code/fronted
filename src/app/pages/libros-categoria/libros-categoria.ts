import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
selector: 'app-libros-categoria',
imports: [
MatIconModule,
MatButtonModule,
],
templateUrl: './libros-categoria.html',
})
export class LibrosCategoria{


categoria = signal('');

books = signal([
    {
        title: 'Manual de Marketing Digital',
        author: 'Juan Pérez',
        category: 'Marketing',
        year: 2024,
        format: 'PDF',
    },
    {
        title: 'Fundamentos de Publicidad',
        author: 'María González',
        category: 'Marketing',
        year: 2023,
        format: 'PDF',
    },
    {
        title: 'Marketing Estratégico',
        author: 'Carlos López',
        category: 'Marketing',
        year: 2024,
        format: 'PDF',
    },
    {
        title: 'Análisis y diseño de base de datos',
        author: 'Pedro Sánchez',
        category: 'Desarrollo de Software',
        year: 2023,
        format: 'PDF',
    },
    {
        title: 'Programación Web con Angular',
        author: 'Luis Andrade',
        category: 'Desarrollo de Software',
        year: 2025,
        format: 'PDF',
    },
    {
        title: 'English for Beginners',
        author: 'James Smith',
        category: 'Idiomas',
        year: 2022,
        format: 'PDF',
    },
    {
        title: 'Diseño de Modas',
        author: 'Ana Torres',
        category: 'Diseño de Modas',
        year: 2024,
        format: 'PDF',
    },
]);

constructor(
    private route: ActivatedRoute,
    private router: Router
) {
    this.route.paramMap.subscribe(params => {
        this.categoria.set(params.get('categoria') ?? '');
    });
}

get filteredBooks() {
    return this.books().filter(
        book => book.category === this.categoria()
    );
}

volver() {
    this.router.navigate(['/pages/categorias']);
}

}
