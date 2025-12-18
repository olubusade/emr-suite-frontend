import { catchError, map, OperatorFunction, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http'; // 💡 Import HttpErrorResponse for precise typing

/**
 * ✅ Centralized RxJS operator for API responses.
 * * Responsibilities:
 * - Normalizes API responses ({ data }, { result }, or raw)
 * - Handles network/server errors with meaningful messages
 * - Logs all responses and errors only in development mode
 * * @template T The expected type of the unwrapped data.
 */
// 🔑 FIX: The input stream is now typed as `unknown` to represent the raw HTTP response body.
export function apiOperators<T>(): OperatorFunction<unknown, T> {
  return (source$) =>
    source$.pipe(
      // 🔑 FIX: Response is typed as `unknown` (the raw HTTP response body)
      map((response: unknown) => {
        if (!environment.production) {
          console.warn('🌐 [API Response]:', response);
        }

        // Normalize response shape (common for REST APIs)
        if (response && typeof response === 'object' && response !== null) {
          const res = response as Record<string, unknown>; // 🔑 Cast to a record to safely check properties
          
          if (res.data !== undefined) {
            return res.data as T;
          }
          if (res.result !== undefined) {
            return res.result as T;
          }
        }
        
        // Return the response as is if no wrapper found
        return response as T;
      }),

      // 🔑 FIX: Error is typed as `unknown` (but we check if it's HttpErrorResponse)
      catchError((error: unknown) => {
        let status = 0;
        let message = 'An unexpected error occurred.';
        let originalError: unknown = error;
        
        // 🔑 Guard check: Check if the error is a standard Angular HTTP error
        if (error instanceof HttpErrorResponse) {
          status = error.status;
          originalError = error;
          
          if (status === 0) {
            // Includes CORS failures and actual network issues
            message = 'Network error. Please check your internet connection.';
          } else if (status >= 400 && status < 500) {
            // Attempt to get a message from the body (e.g., { message: '...' })
            message = (error.error as { message?: string })?.message 
                      || error.message // Fallback to Angular's default message
                      || 'Invalid request. Please try again.';
          } else if (status >= 500) {
            message = 'Server error. Please try again later.';
          }
        } else {
            // Handle non-HTTP errors (e.g., errors thrown within map, or RxJS errors)
            status = 500;
            message = (error as Error)?.message || 'A catastrophic error occurred outside the API.';
        }

        if (!environment.production) {
          console.error(`❌ [API ERROR ${status}]`, originalError);
        }

        // Rethrow standardized error object
        return throwError(() => ({
          status,
          message,
          original: originalError,
        }));
      })
    );
}