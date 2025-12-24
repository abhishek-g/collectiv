import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'profile',
    canActivate: [() => import('./guards/auth.guard').then((m) => m.authGuard)],
    loadComponent: () =>
      import('@nx-angular-express/profile').then((m) => m.ProfileComponent),
  },
];
