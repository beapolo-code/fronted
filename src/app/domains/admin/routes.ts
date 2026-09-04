import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		component: AdminLayout,
		children: [
			// Redirect empty path to 'libros-categoria'
			{ path: '', pathMatch: 'full', redirectTo: 'inicio' },

			// -----------------------------------------------------------------------
			// Custom pages (src/app/pages)
			// -----------------------------------------------------------------------
			{
				path: 'inicio',
				loadComponent: () =>
					import('../../pages/inicio/inicio').then((m) => m.Inicio),
			},
			{
				path: 'libros-categoria',
				redirectTo: 'libros-categoria/General',
				pathMatch: 'full',
			},
			{
				path: 'libros-categoria/:categoria',
				loadComponent: () =>
					import('../../pages/libros-categoria/libros-categoria').then(
						(m) => m.LibrosCategoria
					),
			},
			{
				path: 'administracion-libros',
				loadComponent: () =>
					import(
						'../../pages/book-management/book-management.component'
					).then((m) => m.BookManagementComponent),
			},
			{
				path: 'videos',
				loadComponent: () =>
					import('../../pages/videos/videos').then((m) => m.VideosComponent),
			},
			{
				path: 'mi-componente',
				loadComponent: () =>
					import('../../pages/my-component/my-component').then(
						(m) => m.MyComponent
					),
			},
			{
				path: 'pages/categories',
				loadComponent: () =>
					import('../../pages/my-component/my-component').then(
						(m) => m.MyComponent
					),
			},
			{
				path: 'usuarios',
				loadChildren: () => import('./modules/usuarios/routes'),
			},

			// -----------------------------------------------------------------------
			// Dashboards
			// -----------------------------------------------------------------------
			{
				path: 'dashboards',
				loadChildren: () => import('./modules/dashboards/routes'),
			},

			// -----------------------------------------------------------------------
			// General
			// -----------------------------------------------------------------------
			{
				path: 'academy',
				loadChildren: () => import('./modules/apps/academy/routes'),
			},
			{
				path: 'ai-chat',
				loadChildren: () => import('./modules/apps/ai-chat/routes'),
			},
			{
				path: 'calendar',
				loadChildren: () => import('./modules/apps/calendar/routes'),
			},
			{
				path: 'contacts',
				loadChildren: () => import('./modules/apps/contacts/routes'),
			},
			{
				path: 'file-manager',
				loadChildren: () => import('./modules/apps/file-manager/routes'),
			},
			{
				path: 'help-center',
				loadChildren: () => import('./modules/apps/help-center/routes'),
			},
			{
				path: 'mailbox',
				loadChildren: () => import('./modules/apps/mailbox/routes'),
			},
			{
				path: 'notes',
				loadChildren: () => import('./modules/apps/notes/routes'),
			},
			{
				path: 'orders',
				loadChildren: () => import('./modules/apps/orders/routes'),
			},
			{
				path: 'scrumboard',
				loadChildren: () => import('./modules/apps/scrumboard/routes'),
			},
			{
				path: 'tasks',
				loadChildren: () => import('./modules/apps/tasks/routes'),
			},

			// -----------------------------------------------------------------------
			// Extras
			// -----------------------------------------------------------------------
			{
				path: 'invoice',
				loadChildren: () => import('./modules/extras/invoice/routes'),
			},
			{
				path: 'profile',
				loadChildren: () => import('./modules/extras/profile/routes'),
			},
			{
				path: 'settings',
				loadChildren: () => import('./modules/extras/settings/routes'),
			},
			{
				path: 'notifications',
				loadChildren: () => import('./modules/extras/notifications/routes'),
			},
			{
				path: 'favoritos',
				loadChildren: () => import('./modules/extras/favorites/routes'),
			},
			{
				path: 'error',
				loadChildren: () => import('./modules/extras/error/routes'),
			},

			// -----------------------------------------------------------------------
			// Documentation
			// -----------------------------------------------------------------------
			{
				path: 'documentation',
				loadChildren: () => import('./modules/documentation/routes'),
			},

			// 404
			{
				path: '404',
				pathMatch: 'full',
				loadComponent: () =>
					import('./modules/extras/error/features/error-404'),
			},

			// Catch all
			{ path: '**', redirectTo: '404' },
		],
	},
];
