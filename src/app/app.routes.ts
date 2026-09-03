import { Route } from '@angular/router';

export const routes: Route[] = [
  // Admin
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/routes').then((m) => m.ADMIN_ROUTES),
  },

  // Website routes
  {
    path: 'home',
    loadChildren: () => import('./domains/website/routes'),
  },

  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Coming soon
  {
    path: 'coming-soon',
    loadChildren: () => import('./domains/coming-soon/routes'),
  },

  // Maintenance
  {
    path: 'maintenance',
    loadChildren: () => import('./domains/maintenance/routes'),
  },

  // Redirects
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin',
  },
  {
    path: '**',
    redirectTo: 'admin',
  },
];
