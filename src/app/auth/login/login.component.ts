import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false;
  hide = true;
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.isLoading = true;
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (isValid) => {
        if (!isValid) {
            this.showSnackBar('Neispravno korisničko ime ili lozinka. Pokušajte ponovo.');
        } else {
          // redirect to admin dashboard
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private showSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000
    });
  }
}
