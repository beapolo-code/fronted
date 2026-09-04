import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../services/profile';
import { UsersService } from '../../../usuarios/usuarios.service';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export default class Profile {
  private readonly profileService = inject(ProfileService);
  private readonly usersService = inject(UsersService);

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isEditing = signal(false);
  protected readonly isSupportOpen = signal(false);
  protected readonly user = signal<UserProfile | null>(null);

  protected editName = '';
  protected editBio = '';

  constructor() {
    void this.cargarPerfil();
  }

  protected cargarPerfil(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usersService
      .findAll()
      .then((usuarios) => {
        if (!usuarios.length) {
          throw new Error('No hay usuarios registrados en el sistema');
        }
        const objetivo =
          usuarios.find((u) => u.is_active && u.role === 'admin') ??
          usuarios.find((u) => u.is_active) ??
          usuarios[0];
        return this.profileService.getProfile(objetivo.id);
      })
      .then((perfil) => {
        this.user.set(perfil);
        this.editName = perfil.name;
        this.editBio = perfil.bio ?? '';
      })
      .catch((err) => {
        console.error('Error al cargar el perfil:', err);
        this.error.set('No se pudo cargar el perfil.');
      })
      .finally(() => this.cargando.set(false));
  }

  protected usuario() {
    const u = this.user();
    if (!u) {
      return { name: '', email: '', bio: '', role: '', avatarInitial: '' };
    }
    return {
      name: u.name,
      email: u.email,
      bio: u.bio ?? '',
      role: u.role,
      avatarInitial: u.name.charAt(0).toUpperCase() || 'U',
    };
  }

  protected toggleAccountSettings(): void {
    this.isEditing.update((v) => !v);
    if (this.isEditing()) {
      const u = this.user();
      this.editName = u?.name ?? '';
      this.editBio = u?.bio ?? '';
      this.isSupportOpen.set(false);
    }
  }

  protected saveAccountSettings(): void {
    const u = this.user();
    if (!u) return;
    this.guardando.set(true);

    this.profileService
      .updateProfile(u.id, { name: this.editName, bio: this.editBio })
      .then((perfil) => {
        this.user.set(perfil);
        this.editName = perfil.name;
        this.editBio = perfil.bio ?? '';
        this.isEditing.set(false);
      })
      .catch((err) => {
        console.error('Error al guardar cambios del perfil:', err);
        this.error.set('No se pudieron guardar los cambios.');
      })
      .finally(() => this.guardando.set(false));
  }

  protected toggleSupport(): void {
    this.isSupportOpen.update((v) => !v);
    if (this.isSupportOpen()) {
      this.isEditing.set(false);
    }
  }
}