import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  passwordFieldName: string,
  passwordConfirmFieldName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordFieldName);
    const passwordConfirm = control.get(passwordConfirmFieldName);

    if (
      !password ||
      !passwordConfirm ||
      !password.value ||
      !passwordConfirm.value
    ) {
      return null;
    }

    const errors = passwordConfirm.errors;

    if (password.value !== passwordConfirm.value) {
      if (errors) {
        passwordConfirm.setErrors({
          ...passwordConfirm.errors,
          mismatch: true,
        });
      } else {
        passwordConfirm.setErrors({ mismatch: true });
      }
      return { mismatch: true };
    }

    if (errors && 'mismatch' in errors) {
      if (Object.keys(errors).length === 1) {
        passwordConfirm.setErrors(null);
      } else {
        delete errors['mismatch'];
        passwordConfirm.setErrors(errors);
      }
    }
    return null;
  };
}
