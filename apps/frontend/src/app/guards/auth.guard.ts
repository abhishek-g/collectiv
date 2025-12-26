import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Single auth guard:
 * - If route provides data.redirectAuthenticatedTo and token is present -> redirect there
 * - Else if token missing and route is not 'auth' -> redirect to /auth
 * - Else allow
 */
export const authGuard: CanActivateFn = (route, _state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasToken = authService.isAuthenticated();
  const path = route.routeConfig?.path;
  // Optional route-provided redirect when already authenticated
  const redirectIfAuthed: string | undefined =
    (route.routeConfig?.data as { redirectAuthenticatedTo?: string } | undefined)
      ?.redirectAuthenticatedTo;

  if (hasToken && redirectIfAuthed) {
    return router.parseUrl(redirectIfAuthed);
  }

  if (!hasToken && path !== 'auth') {
    return router.parseUrl('/auth');
  }

  return true;
};

