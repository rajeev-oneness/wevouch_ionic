import { ValidatorFn, AbstractControl  } from '@angular/forms';

export class ConfirmPasswordValidator {
  static equalto(field): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

    let input = control.value;

    let isValid=control.root.value[field]==input
    if(!isValid)
      return { 'equalTo': {isValid} }
    else
      return null
    }
  }
}
