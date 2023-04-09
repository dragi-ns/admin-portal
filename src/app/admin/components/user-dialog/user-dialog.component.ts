import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '../../interfaces/user';
import { passwordsMatchValidator } from '../../validators/passwordsMatchValidator';
import { alphaValidator } from '../../validators/alphaValidator';
import { UniqueEmailValidator } from '../../validators/UniqueEmailValidator';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  @Output() submitted = new EventEmitter<User>();
  hide = true;
  loading = false;
  userForm: FormGroup = this.fb.group(
    {
      firstName: [
        '',
        [Validators.required, Validators.maxLength(20), alphaValidator()],
      ],
      lastName: [
        '',
        [Validators.required, Validators.maxLength(20), alphaValidator()],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
        [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('password', 'passwordConfirm') }
  );

  constructor(
    private fb: FormBuilder,
    private uniqueEmailValidator: UniqueEmailValidator,
    @Inject(MAT_DIALOG_DATA) public data?: User
  ) {
    if (this.data) {
      this.userForm.patchValue(this.data);
      this.passwordConfirm?.setValue(this.data.password);
      this.uniqueEmailValidator.originalEmail = this.data.email;
    }
  }

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get passwordConfirm() {
    return this.userForm.get('passwordConfirm');
  }

  onSubmit() {
    this.submitted.emit(this.userForm.getRawValue());
  }
}
