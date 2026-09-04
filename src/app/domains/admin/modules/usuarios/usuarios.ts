import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UsersService, Usuario } from './usuarios.service';

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
  private readonly usersService = inject(UsersService);

  readonly busqueda = signal('');
  readonly mostrarFormulario = signal(false);
  readonly usuarioEditandoId = signal<string | null>(null);
  readonly mensaje = signal('');
  readonly formulario = signal<FormularioUsuario>({
    ...FORMULARIO_INICIAL,
  });
  readonly cargando = signal(false);

  readonly columnas: string[] = [
    'id_temp',
    'name',
    'email',
    'role',
    'is_active',
    'created_at',
    'acciones',
  ];

  readonly usuarios = signal<Usuario[]>([]);

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

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.cargando.set(true);
    try {
      this.usuarios.set(await this.usersService.findAll());
    } finally {
      this.cargando.set(false);
    }
  }

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

  async guardarUsuario(): Promise<void> {
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

    try {
      if (editandoId) {
        await this.usersService.update(editandoId, {
          id_temp: datos.id_temp.trim(),
          name: datos.name.trim(),
          email: datos.email.trim(),
          password: datos.password.trim() || undefined,
          role: datos.role,
          is_active: datos.is_active,
        });
        this.mensaje.set('Usuario actualizado correctamente.');
      } else {
        if (!datos.password.trim()) {
          this.mensaje.set('La contraseña es obligatoria para un usuario nuevo.');
          return;
        }

        await this.usersService.create({
          id_temp: datos.id_temp.trim() || undefined,
          name: datos.name.trim(),
          email: datos.email.trim(),
          password: datos.password.trim(),
          role: datos.role,
          is_active: datos.is_active,
        });
        this.mensaje.set('Usuario registrado correctamente.');
      }

      await this.cargarUsuarios();
      this.usuarioEditandoId.set(null);
      this.formulario.set({ ...FORMULARIO_INICIAL });

      setTimeout(() => {
        this.mostrarFormulario.set(false);
        this.mensaje.set('');
      }, 1000);
    } catch (error: unknown) {
      this.mensaje.set(
        (error as { error?: { message?: string } })?.error?.message ??
          'No se pudo guardar el usuario.'
      );
    }
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

  async cambiarEstado(id: string): Promise<void> {
    const usuario = this.usuarios().find((item) => item.id === id);
    if (!usuario) {
      return;
    }

    try {
      await this.usersService.setActive(id, !usuario.is_active);
      await this.cargarUsuarios();
    } catch {
      this.mensaje.set('No se pudo cambiar el estado del usuario.');
    }
  }

  async eliminarUsuario(id: string): Promise<void> {
    const usuario = this.usuarios().find((item) => item.id === id);

    if (!usuario) {
      return;
    }

    const confirmado = window.confirm(
      `¿Estás seguro de eliminar a ${usuario.name}?`
    );

    if (!confirmado) {
      return;
    }

    try {
      await this.usersService.remove(id);
      await this.cargarUsuarios();
    } catch {
      this.mensaje.set('No se pudo eliminar el usuario.');
    }
  }

  trackById(index: number, usuario: Usuario): string {
    return usuario.id;
  }

  private correoValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}