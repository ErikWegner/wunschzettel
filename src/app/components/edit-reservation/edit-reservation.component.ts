import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { confirmEditReservation } from 'src/app/store/r.actions';
import {
  selectReservationErrorText,
  selectReservationState,
} from 'src/app/store/r.selectors';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss'],
})
export class EditReservationComponent {
  reservationStatus$ = this.store.select(selectReservationState);
  reservationErrorText$ = this.store.select(selectReservationErrorText);

  @Output()
  action = new EventEmitter<{ action: 'reserve' | 'clear' }>();

  constructor(private store: Store) {}

  onClickClearReservation(): void {
    this.store.dispatch(confirmEditReservation({ targetState: 'clear' }));
  }

  onClickReservation(): void {
    this.store.dispatch(confirmEditReservation({ targetState: 'reserve' }));
  }
}
