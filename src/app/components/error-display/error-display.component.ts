import { Component } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { clearFailedRequestAndRetry } from 'src/app/store/a.actions';
import {
  selectHasRequestError,
  selectRequestError,
} from 'src/app/store/a.selectors';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss'],
})
export class ErrorDisplayComponent {
  hasRequestError$ = this.store.select(selectHasRequestError);
  error$ = this.store.select(selectRequestError);

  constructor(private store: Store) {}

  public dispatchRetryAction(action: Action) {
    this.store.dispatch(clearFailedRequestAndRetry({ action }));
  }
}
