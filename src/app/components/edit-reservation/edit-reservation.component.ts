import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
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

  constructor(private store: Store) {}
}
