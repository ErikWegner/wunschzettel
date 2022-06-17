import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRequestError } from 'src/app/store/a.selectors';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss'],
})
export class ErrorDisplayComponent {
  error$ = this.store.select(selectRequestError);

  constructor(private store: Store) {}
}
