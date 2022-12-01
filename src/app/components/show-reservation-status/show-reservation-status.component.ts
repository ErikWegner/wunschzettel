import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { confirmEditReservation } from 'src/app/store/r.actions';
import {
  selectReservationErrorText,
  selectReservationState,
} from 'src/app/store/r.selectors';

@Component({
  selector: 'app-show-reservation-status',
  templateUrl: './show-reservation-status.component.html',
  styleUrls: ['./show-reservation-status.component.scss'],
})
export class ShowReservationStatusComponent {
  reservationStatus$ = this.store.select(selectReservationState);
  reservationErrorText$ = this.store.select(selectReservationErrorText);

  constructor(private store: Store) {}

  onClickClearReservation(): void {
    this.store.dispatch(confirmEditReservation({ targetState: 'clear' }));
  }

  onClickReservation(): void {
    this.store.dispatch(confirmEditReservation({ targetState: 'reserve' }));
  }
}
