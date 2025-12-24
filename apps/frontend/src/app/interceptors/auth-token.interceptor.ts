import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Token Interceptor
 * Attaches the JWT from localStorage as a Bearer token to outgoing requests
 * if the request does not already have an Authorization header.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token && !req.headers.has('Authorization')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};

