import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const valid = phoneRegex.test(control.value.replace(/\s/g, ''));
      
      return valid ? null : { phone: true };
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const hasNumber = /[0-9]/.test(control.value);
      const hasUpper = /[A-Z]/.test(control.value);
      const hasLower = /[a-z]/.test(control.value);
      const hasSpecial = /[#?!@$%^&*-]/.test(control.value);
      const isValidLength = control.value.length >= 8;
      
      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;
      
      if (!passwordValid) {
        return {
          strongPassword: {
            hasNumber,
            hasUpper,
            hasLower,
            hasSpecial,
            isValidLength
          }
        };
      }
      
      return null;
    };
  }

  static passwordMatch(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordControlName);
      const confirmPassword = control.get(confirmPasswordControlName);
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMatch: true });
        return { passwordMatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMatch'];
          confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
        }
        return null;
      }
    };
  }

  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return selectedDate >= today ? null : { futureDate: true };
    };
  }

  static businessHours(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const time = control.value;
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      // Business hours: 9:00 AM to 8:00 PM
      const openTime = 9 * 60; // 9:00 AM
      const closeTime = 20 * 60; // 8:00 PM
      
      return timeInMinutes >= openTime && timeInMinutes <= closeTime 
        ? null 
        : { businessHours: true };
    };
  }

  static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  static timeInterval(intervalMinutes: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const time = control.value;
      const [hours, minutes] = time.split(':').map(Number);
      
      return minutes % intervalMinutes === 0 
        ? null 
        : { timeInterval: { interval: intervalMinutes } };
    };
  }

  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const isWhitespace = (control.value || '').trim().length === 0;
      return !isWhitespace ? null : { whitespace: true };
    };
  }

  static fileSize(maxSizeInBytes: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const file = control.value as File;
      return file.size <= maxSizeInBytes 
        ? null 
        : { fileSize: { maxSize: maxSizeInBytes, actualSize: file.size } };
    };
  }

  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const file = control.value as File;
      return allowedTypes.includes(file.type) 
        ? null 
        : { fileType: { allowedTypes, actualType: file.type } };
    };
  }
}
