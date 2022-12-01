import { createAction, props } from '@ngrx/store';
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

export const confirmEditReservation = createAction(
  '[R] Confirm edit reservation status',
  props<{
    targetState: 'reserve' | 'clear';
  }>()
);
