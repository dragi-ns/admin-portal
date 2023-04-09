import { Injectable } from '@angular/core';
import { delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly adminEmail = 'office@angular.com';
  private readonly adminPassword = 'password';
  isLoggedIn = false;

  constructor() {
    const storedValue = localStorage.getItem('loggedIn');
    if (storedValue) {
      this.isLoggedIn = JSON.parse(storedValue);
    }
  }

  login(data: { email: string; password: string }) {
    const isValid =
      data.email === this.adminEmail && data.password === this.adminPassword;
    return of(isValid).pipe(
      delay(1000),
      tap((isValid) => {
        this.isLoggedIn = isValid;
        if (this.isLoggedIn) {
          localStorage.setItem('loggedIn', 'true');
        }
      })
    );
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('loggedIn');
  }
}
