import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function tajValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const taj = control.value;

        if (!taj) {
            return null; // Required validation should be handled by Validators.required
        }

        if (taj.length !== 9 || !/^\d{9}$/.test(taj)) {
            return { invalidTaj: true };
        }

        let sum = 0;
        for (let i = 0; i < 8; i++) {
            const digit = parseInt(taj.charAt(i), 10);
            if ((i + 1) % 2 !== 0) {
                sum += digit * 3;
            } else {
                sum += digit * 7;
            }
        }

        const checkDigit = sum % 10;
        const actualCheckDigit = parseInt(taj.charAt(8), 10);

        return checkDigit === actualCheckDigit ? null : { invalidTaj: true };
    };
}
