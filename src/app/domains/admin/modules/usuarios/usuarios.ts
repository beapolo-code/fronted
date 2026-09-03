import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Usuario {
  id: string;
  id_temp: string | null;
  email: string;
  password_hash: string | null;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: Date;
}

interface FormularioUsuario {
  id_temp: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
}

const FORMULARIO_INICIAL: FormularioUsuario = {
  id_temp: '',
  email: '',
  password: '',
  name: '',
  role: 'user',
  is_active: true,
};

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './usuarios.html',
})
export class UsuariosComponent {
  readonly busqueda = signal('');
  readonly mostrarFormulario = signal(false);
  readonly usuarioEditandoId = signal<string | null>(null);
  readonly mensaje = signal('');
  readonly formulario = signal<FormularioUsuario>({
    ...FORMULARIO_INICIAL,
  });

  readonly columnas: string[] = [
    'id_temp',
    'name',
    'email',
    'role',
    'is_active',
    'created_at',
    'acciones',
  ];

  readonly usuarios = signal<Usuario[]>([
    {
      id: '11fe4567-e89b-12d3-a456-426614174000',
      id_temp: 'USR-001',
      email: 'alexander6621@gmail.com',
      password_hash: 'hash_simulado_1',
      name: 'Alexander García',
      role: 'admin',
      is_active: true,
      created_at: new Date('2026-08-30T10:30:00'),
    },
    {
      id: '22fe4567-e89b-12d3-a456-426614174001',
      id_temp: 'USR-002',
      email: 'mlopez@dominio.com',
      password_hash: 'hash_simulado_2',
      name: 'María López',
      role: 'user',
      is_active: true,
      created_at: new Date('2026-08-31T14:20:00'),
    },
    {
      id: '33fe4567-e89b-12d3-a456-426614174002',
      id_temp: 'USR-003',
      email: 'cruiz@dominio.com',
      password_hash: 'hash_simulado_3',
      name: 'Carlos Ruiz',
      role: 'user',
      is_active: false,
      created_at: new Date('2026-09-01T09:15:00'),
    },
  ]);

  readonly usuariosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();

    if (!texto) {
      return this.usuarios();
    }

    return this.usuarios().filter((usuario) => {
      return (
        usuario.name.toLowerCase().includes(texto) ||
        usuario.email.toLowerCase().includes(texto) ||
        usuario.role.toLowerCase().includes(texto) ||
        usuario.id_temp?.toLowerCase().includes(texto) ||
        usuario.id.toLowerCase().includes(texto)
      );
    });
  });

  readonly totalUsuarios = computed(() => this.usuarios().length);

  readonly totalActivos = computed(
    () => this.usuarios().filter((usuario) => usuario.is_active).length
  );

  readonly totalInactivos = computed(
    () => this.usuarios().filter((usuario) => !usuario.is_active).length
  );

  readonly tituloFormulario = computed(() =>
    this.usuarioEditandoId() ? 'Editar usuario' : 'Registrar nuevo usuario'
  );

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  abrirFormulario(): void {
    this.usuarioEditandoId.set(null);
    this.formulario.set({ ...FORMULARIO_INICIAL });
    this.mensaje.set('');
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.usuarioEditandoId.set(null);
    this.formulario.set({ ...FORMULARIO_INICIAL });
    this.mensaje.set('');
  }

  actualizarTexto(
    campo: 'id_temp' | 'email' | 'password' | 'name',
    event: Event
  ): void {
    const input = event.target as HTMLInputElement;

    this.formulario.update((formulario) => ({
      ...formulario,
      [campo]: input.value,
    }));
  }

  actualizarRol(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.formulario.update((formulario) => ({
      ...formulario,
      role: select.value as 'admin' | 'user',
    }));
  }

  actualizarEstado(isActive: boolean): void {
    this.formulario.update((formulario) => ({
      ...formulario,
      is_active: isActive,
    }));
  }

  guardarUsuario(): void {
    const datos = this.formulario();
    const editandoId = this.usuarioEditandoId();

    if (!datos.name.trim() || !datos.email.trim()) {
      this.mensaje.set('El nombre y el correo son obligatorios.');
      return;
    }

    if (!this.correoValido(datos.email)) {
      this.mensaje.set('Ingresa un correo electrónico válido.');
      return;
    }

    const correoRepetido = this.usuarios().some(
      (usuario) =>
        usuario.email.toLowerCase() === datos.email.toLowerCase().trim() &&
        usuario.id !== editandoId
    );

    if (correoRepetido) {
      this.mensaje.set('El correo electrónico ya está registrado.');
      return;
    }

    if (!editandoId && !datos.password.trim()) {
      this.mensaje.set('La contraseña es obligatoria para un usuario nuevo.');
      return;
    }

    if (editandoId) {
      this.usuarios.update((usuarios) =>
        usuarios.map((usuario) => {
          if (usuario.id !== editandoId) {
            return usuario;
          }

          return {
            ...usuario,
            id_temp: datos.id_temp.trim() || null,
            email: datos.email.trim(),
            password_hash: datos.password.trim()
              ? 'hash_simulado_actualizado'
              : usuario.password_hash,
            name: datos.name.trim(),
            role: datos.role,
            is_active: datos.is_active,
          };
        })
      );

      this.mensaje.set('Usuario actualizado correctamente.');
    } else {
      const nuevoUsuario: Usuario = {
        id: crypto.randomUUID(),
        id_temp: datos.id_temp.trim() || null,
        email: datos.email.trim(),
        password_hash: 'hash_simulado_frontend',
        name: datos.name.trim(),
        role: datos.role,
        is_active: datos.is_active,
        created_at: new Date(),
      };

      this.usuarios.update((usuarios) => [
        nuevoUsuario,
        ...usuarios,
      ]);

      this.mensaje.set('Usuario registrado correctamente.');
    }

    this.usuarioEditandoId.set(null);
    this.formulario.set({ ...FORMULARIO_INICIAL });

    setTimeout(() => {
      this.mostrarFormulario.set(false);
      this.mensaje.set('');
    }, 1000);
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditandoId.set(usuario.id);

    this.formulario.set({
      id_temp: usuario.id_temp ?? '',
      email: usuario.email,
      password: '',
      name: usuario.name,
      role: usuario.role,
      is_active: usuario.is_active,
    });

    this.mensaje.set('');
    this.mostrarFormulario.set(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  cambiarEstado(id: string): void {
    this.usuarios.update((usuarios) =>
      usuarios.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              is_active: !usuario.is_active,
            }
          : usuario
      )
    );
  }

  eliminarUsuario(id: string): void {
    const usuario = this.usuarios().find(
      (item) => item.id === id
    );

    if (!usuario) {
      return;
    }

    const confirmado = window.confirm(
      `¿Estás seguro de eliminar a ${usuario.name}?`
    );

    if (!confirmado) {
      return;
    }

    this.usuarios.update((usuarios) =>
      usuarios.filter((item) => item.id !== id)
    );
  }

  trackById(index: number, usuario: Usuario): string {
    return usuario.id;
  }

  private correoValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}