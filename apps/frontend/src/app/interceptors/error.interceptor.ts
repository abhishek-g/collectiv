import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@nx-angular-express/shared-components';
// $localize is provided as a polyfill in project.json - no import needed

/**
 * HTTP Error Interceptor
 *
 * Automatically handles common HTTP errors and displays toast notifications:
 * - 401: Authentication errors (invalid credentials, expired tokens)
 * - 403: Access denied (insufficient permissions)
 * - 404: Resource not found
 * - 409: Conflict (duplicate resources)
 * - 500+: Server errors
 * - Network errors: Connection issues
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Debug: Log that interceptor is being called
      console.log('[Error Interceptor] Caught error:', error.status, error.error);

      // Extract error message from response
      let errorMessage = $localize`:@@error.generic:An error occurred`;
      let errorTitle = $localize`:@@error.title:Error`;

      // Extract error message from various response formats
      if (error.error) {
        // Check if it's our HttpResponse format { success: false, error: "message" }
        if (error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Set appropriate title and message based on status code
      switch (error.status) {
        case 0:
          // Network error (no response from server)
          errorTitle = $localize`:@@error.network.title:Network Error`;
          errorMessage = $localize`:@@error.network.message:Unable to connect to the server. Please check your internet connection.`;
          break;

        case 401:
          // Unauthorized - Authentication required or failed
          errorTitle = $localize`:@@error.401.title:Authentication Error`;
          errorMessage = errorMessage || $localize`:@@error.401.message:Please check your credentials and try again.`;
          break;

        case 403:
          // Forbidden - Access denied
          errorTitle = $localize`:@@error.403.title:Access Denied`;
          errorMessage = errorMessage || $localize`:@@error.403.message:You do not have permission to perform this action.`;
          break;

        case 404:
          // Not Found
          errorTitle = $localize`:@@error.404.title:Not Found`;
          errorMessage = errorMessage || $localize`:@@error.404.message:The requested resource was not found.`;
          break;

        case 409:
          // Conflict - Duplicate resource
          errorTitle = $localize`:@@error.409.title:Conflict`;
          errorMessage = errorMessage || $localize`:@@error.409.message:This resource already exists.`;
          break;

        case 422:
          // Unprocessable Entity - Validation errors
          errorTitle = $localize`:@@error.422.title:Validation Error`;
          errorMessage = errorMessage || $localize`:@@error.422.message:Please check your input and try again.`;
          break;

        case 429:
          // Too Many Requests - Rate limiting
          errorTitle = $localize`:@@error.429.title:Too Many Requests`;
          errorMessage = errorMessage || $localize`:@@error.429.message:Too many requests. Please try again later.`;
          break;

        default:
          if (error.status >= 500) {
            // Server errors (500, 502, 503, etc.)
            errorTitle = $localize`:@@error.500.title:Server Error`;
            errorMessage = errorMessage || $localize`:@@error.500.message:A server error occurred. Please try again later.`;
          } else if (error.status >= 400) {
            // Other client errors (400, 402, 405, etc.)
            errorTitle = $localize`:@@error.400.title:Request Error`;
            errorMessage = errorMessage || $localize`:@@error.400.message:Please check your input and try again.`;
          }
          break;
      }

      // Show toast notification for all errors
      // Use setTimeout to ensure toast is shown in the next tick (after current change detection cycle)
      setTimeout(() => {
        toastService.error(errorTitle, errorMessage, {
          delay: 6000,
          autohide: true,
          dismissible: true,
        });
      }, 0);

      // Re-throw the error so components can still handle it if needed
      // This allows components to perform additional error handling (e.g., redirect on 401)
      return throwError(() => error);
    })
  );
};

