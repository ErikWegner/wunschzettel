import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectHasPendingRequest } from 'src/app/store/a.selectors';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
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

  constructor(private fb: FormBuilder, private store: Store) {}
}
