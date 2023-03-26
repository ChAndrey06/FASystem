import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

interface HttpClientGetOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  } | undefined;
  context?: HttpContext | undefined;
  observe?: "body" | undefined;
  params?: HttpParams;
  reportProgress?: boolean | undefined;
  responseType?: "json" | undefined;
  withCredentials?: boolean | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public get hostUrl(): string {
    return environment.apiUrl;
  }

  constructor(
    private readonly httpService: HttpClient
  ) { }

  public get<T>(subUrl: string, options?: HttpClientGetOptions): Observable<T> {
    const url = this.getFullUrl(subUrl);
    return this.httpService.get<T>(url, options);
  }

  public post<T>(subUrl: string, data: unknown): Observable<T> {
    const url = this.getFullUrl(subUrl);

    return this.httpService.post<T>(url, data);
  }

  public put<T>(subUrl: string, data: unknown): Observable<T> {
    const url = this.getFullUrl(subUrl);

    return this.httpService.put<T>(url, data);
  }

  public delete<T>(subUrl: string): Observable<T> {
    const url = this.getFullUrl(subUrl);

    return this.httpService.delete<T>(url);
  }

  private getFullUrl(subUrl: string): string {
    return `${this.hostUrl}${subUrl}`;
  }
}
