import { Route } from '@angular/router';

const authGuard = () => import('./guards/auth.guard').then((m) => m.authGuard);

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [authGuard],
    data: { redirectAuthenticatedTo: '/communities' },
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'communities',
    canActivate: [authGuard],
    data: { redirectAuthenticatedTo: '/communities' },
    loadComponent: () =>
      import('./pages/communities/communities.component').then((m) => m.CommunitiesComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    data: { redirectAuthenticatedTo: '/profile' },
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
];
