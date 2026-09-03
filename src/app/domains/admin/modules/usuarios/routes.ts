import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./usuarios').then((m) => m.UsuariosComponent),
  },
];

export default routes;