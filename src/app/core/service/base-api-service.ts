import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiOperators } from '../utils/api-operators';

/**
 * ✅ Base API Service (Enterprise-Ready)
 *
 * Centralized service for all HTTP operations:
 * - Applies consistent API operators for response handling.
 * - Provides type-safe, reusable CRUD helpers.
 * - Reduces repetition in module-specific services.
 */
@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor(protected http: HttpClient) {}

  // 🔹 Generic GET request with query params and headers
  get<T>(url: string, params?: Record<string, any>, headers?: HttpHeaders): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<T>(url, { params: httpParams, headers }).pipe(apiOperators<T>());
  }

  // 🔹 Generic POST request
  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers }).pipe(apiOperators<T>());
  }

  // 🔹 Generic PUT request
  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers }).pipe(apiOperators<T>());
  }

  // 🔹 Generic PATCH request
  patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(url, body, { headers }).pipe(apiOperators<T>());
  }

  // 🔹 Generic DELETE request
  delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(url, { headers }).pipe(apiOperators<T>());
  }

  //Optional helper for building HttpParams dynamically
  protected buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }
}
