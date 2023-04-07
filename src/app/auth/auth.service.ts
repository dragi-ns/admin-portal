import { Injectable } from '@angular/core';
import { delay, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly admin_email = 'office@angular.com';
  private readonly admin_password = 'password';
  isLoggedIn = false;

  constructor() {
    const storedValue = localStorage.getItem('loggedIn');
    if (storedValue) {
      this.isLoggedIn = JSON.parse(storedValue);
    }
  }

  login(data: {email: string, password: string}) {
    const isValid = data.email === this.admin_email && data.password === this.admin_password;
    return of(isValid).pipe(delay(1000), tap((isValid) => {
      this.isLoggedIn = isValid
      if (this.isLoggedIn) {
        localStorage.setItem('loggedIn', 'true');
      }
    }));
  }
}
