import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectReservationState } from 'src/app/store/r.selectors';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss'],
})
export class EditReservationComponent {
  reservationStatus$ = this.store.select(selectReservationState);

  constructor(private store: Store) {}
}
