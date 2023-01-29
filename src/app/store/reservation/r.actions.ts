import { MatDialogRef } from '@angular/material/dialog';
import { createAction, props } from '@ngrx/store';
import { UpdateReservationDialogComponent } from '../../components/update-reservation-dialog/update-reservation-dialog.component';
import { ReservationStatus } from './r.state';

export const retrieveReservationStatus = createAction(
  '[R] Retrieve reservation status',
  props<{
    itemId: number;
  }>()
);

export const reservationStatusResponse = createAction(
  '[R] Reservation status response',
  props<{
    itemId: number;
    status: ReservationStatus;
    errorText: string | null;
  }>()
);

export const modifyReservation = createAction(
  '[R] Modify reservation status',
  props<{
    targetState: 'reserve' | 'clear';
  }>()
);

export const modifyReservationDialogOpened = createAction(
  '[R] Modify reservation status dialog opened',
  props<{
    dialog: MatDialogRef<UpdateReservationDialogComponent>
  }>()
)
