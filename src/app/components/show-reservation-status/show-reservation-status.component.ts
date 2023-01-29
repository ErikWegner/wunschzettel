import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { modifyReservation } from 'src/app/store/reservation/r.actions';
import {
  selectReservationErrorText,
  selectReservationState,
} from 'src/app/store/reservation/r.selectors';

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
    this.store.dispatch(modifyReservation({ targetState: 'clear' }));
  }

  onClickReservation(): void {
    this.store.dispatch(modifyReservation({ targetState: 'reserve' }));
  }
}
