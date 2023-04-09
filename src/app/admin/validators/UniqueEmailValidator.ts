import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { UsersService } from '../services/users.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniqueEmailValidator implements AsyncValidator {
  originalEmail?: string;

  constructor(private usersService: UsersService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.originalEmail && this.originalEmail === control.value) {
      return of(null);
    }

    return this.usersService.getUserByEmail(control.value).pipe(
      map((user) => (user ? { uniqueEmail: true } : null)),
      catchError(() => of(null))
    );
  }
}
