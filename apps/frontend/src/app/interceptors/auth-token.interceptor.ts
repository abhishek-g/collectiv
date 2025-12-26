import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches JWT from localStorage as Bearer token if not already present.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};

