import { Directive, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[appFormEnabled]',
})
export class FormEnabledDirective {
  @Input('appFormEnabled')
  set data(val: boolean) {
    if (val) {
      this.formGroupDirective.form.enable();
    } else {
      this.formGroupDirective.form.disable();
    }
  }
  constructor(private formGroupDirective: FormGroupDirective) {}
}
