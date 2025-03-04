// file.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class FileService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  importTestCasesFromJson(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.API_URL}/files/import/json`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  importTestCasesFromCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.API_URL}/files/import/csv`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  exportTestCases(ids: string[], format: 'json' | 'csv' | 'xml'): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    // Add each ID *separately* to the params.
    ids.forEach(id => {
      params = params.append('ids', id);
    });


    return this.http.get(`${this.API_URL}/files/export/test-cases`, {
      headers: this.getHeaders(),
      params: params,
      responseType: 'blob',
    }).pipe(
      catchError((error) => this.handleError(error))
    );
  }


  exportTestRuns(ids: string[], format: 'json' | 'csv' | 'xml'): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    ids.forEach(id => {
      params = params.append('ids', id);
    });

    return this.http.get(`${this.API_URL}/files/export/test-runs`, {
      headers: this.getHeaders(),
      params: params,
      responseType: 'blob',
    }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Helper function to initiate file download
  downloadFile(data: Blob, filename: string) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
