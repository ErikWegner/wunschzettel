import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectCaptchaRequestText,
  selectHasPendingRequest,
  selectRequestErrorText,
} from 'src/app/store/a.selectors';
import { selectActiveItemAsFormData } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  animations: [
    trigger('alertHighlightTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('80ms', style({ opacity: 1 })),
        animate('80ms', style({ opacity: 0 })),
        animate('80ms', style({ opacity: 1 })),
        animate('80ms', style({ opacity: 0 })),
        animate('80ms', style({ opacity: 1 })),
        animate('80ms', style({ opacity: 0 })),
        animate('80ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ItemFormComponent {
  itemForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    imagesrc: [''],
    buyurl: [''],
    captchaResponse: ['', Validators.required],
  });

  hasRequestPending$ = this.store.select(selectHasPendingRequest);
  formData$ = this.store.select(selectActiveItemAsFormData);
  requestError$ = this.store.select(selectRequestErrorText);
  captchaChallengeText$ = this.store.select(selectCaptchaRequestText);

  constructor(private fb: UntypedFormBuilder, private store: Store) {}
}
