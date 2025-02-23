import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected API_URL = environment.apiUrl;

  constructor(protected http: HttpClient) { }

  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    const options = {
      observe: 'body' as const, // Ensure we only get the response body
      params: params
    };
    return this.http.get<T>(`${this.API_URL}/${path}`, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected post<T>(path: string, body: any | null, params?: HttpParams): Observable<T> {
    const options = {
      observe: 'body' as const, // Ensure we only get the response body
      params: params
    };
    return this.http.post<T>(`${this.API_URL}/${path}`, body, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected put<T>(path: string, body: any | null, params?: HttpParams): Observable<T> {
    const options = {
      observe: 'body' as const, // Ensure we only get the response body
      params: params
    };
    return this.http.put<T>(`${this.API_URL}/${path}`, body, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected delete<T>(path: string, params?: HttpParams): Observable<T> {
    const options = {
      observe: 'body' as const, // Ensure we only get the response body
      params: params
    };
    return this.http.delete<T>(`${this.API_URL}/${path}`, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
