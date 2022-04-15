import { createReducer } from '@ngrx/store';
import { ReservationState } from './r.state';

export const initialState: ReservationState = {
  itemid: null,
  status: 'unknown',
};

export const rReducer = createReducer<ReservationState>(initialState);
