import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { ReservationState } from './r.state';

export const selectFeature = (state: any) => (state as AppState).reservation;

export const selectReservationState = createSelector(
  selectFeature,
  (state: ReservationState) => state.status
);
