import { createAction, props } from '@ngrx/store';

export const retrieveReservationStatus = createAction(
  '[R] Retrieve reservation status',
  props<{
    itemId: number;
  }>()
);
