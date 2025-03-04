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

  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }


  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${path}`, {
      headers: this.getHeaders(),
      params: params,
      observe: 'body'
    }).pipe(
      catchError(this.handleError)
    );
  }

  protected post<T>(path: string, body: any | null, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/${path}`, body, {
      headers: this.getHeaders(),
      params: params,
      observe: 'body'
    }).pipe(
      catchError(this.handleError)
    );
  }

  protected put<T>(path: string, body: any | null, params?: HttpParams): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${path}`, body, {
      headers: this.getHeaders(),
      params: params,
      observe: 'body'
    }).pipe(
      catchError(this.handleError)
    );
  }

  protected delete<T>(path: string, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams;
    body?: any;
  }): Observable<T> {
    const requestOptions = {
      headers: options?.headers || this.getHeaders(),
      params: options?.params,
      body: options?.body,
      observe: 'body' as const
    };

    return this.http.delete<T>(`${this.API_URL}/${path}`, requestOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  protected handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
