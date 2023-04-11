import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { App } from '../interfaces/app';
import { Technology } from '../interfaces/technology';

@Injectable({
  providedIn: 'root',
})
export class AppsService {
  private readonly apiUrlApps = 'http://localhost:3000/applications';
  private readonly apiUrlTech = 'http://localhost:3000/technologies';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getApps(): Observable<App[]> {
    const appsUrl = `${this.apiUrlApps}?_sort=id&_order=desc`;
    return this.http.get<App[]>(appsUrl).pipe(catchError(this.handleError));
  }

  getTechnologies(): Observable<Technology[]> {
    return this.http
      .get<Technology[]>(this.apiUrlTech)
      .pipe(catchError(this.handleError));
  }

  addApp(appData: App): Observable<App> {
    return this.http
      .post<App>(this.apiUrlApps, appData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  editApp(id: number, appData: App): Observable<App> {
    const appUrl = `${this.apiUrlApps}/${id}`;
    return this.http
      .put<App>(appUrl, appData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteApp(id: number): Observable<void> {
    const appUrl = `${this.apiUrlApps}/${id}`;
    return this.http
      .delete<void>(appUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // https://angular.io/guide/http#getting-error-details
  private handleError(error: HttpErrorResponse): Observable<never> {
    let userMsg: string;
    if (error.status === 0) {
      // A client-side or network error occurred.
      userMsg = 'There was an error. Make sure that json-server is running.';
      console.error('An error occurred: ', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      userMsg = 'There was an error. Please try again later.';
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    // Return an observable with a user-facing error message.
    return throwError(() => new Error(userMsg));
  }
}
