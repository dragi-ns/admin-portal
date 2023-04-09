import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = 'http://localhost:3000/users';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const usersUrl = `${this.apiUrl}?_sort=id&_order=desc`;
    return this.http.get<User[]>(usersUrl).pipe(catchError(this.handleError));
  }

  getUserByEmail(email: string): Observable<User | null> {
    const userUrl = `${this.apiUrl}?email=${email}`;
    return this.http.get<User[]>(userUrl).pipe(
      map((users) => (users.length !== 0 ? users[0] : null)),
      catchError(this.handleError)
    );
  }

  addUser(userData: User): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, userData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  editUser(id: string, userData: User): Observable<User> {
    const userUrl = `${this.apiUrl}/${id}`;
    return this.http
      .put<User>(userUrl, userData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<void> {
    const userUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(userUrl).pipe(catchError(this.handleError));
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
