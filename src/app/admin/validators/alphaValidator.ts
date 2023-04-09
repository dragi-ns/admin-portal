import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^\p{L}+$/u;

    if (!control.value) {
      return null;
    }

    if (!regex.test(control.value)) {
      return { alpha: true };
    }

    return null;
  };
}
