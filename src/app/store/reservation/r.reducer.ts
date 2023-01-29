import { createReducer, on } from '@ngrx/store';
import { setActiveItem } from '../w.actions';
import {
  reservationStatusResponse,
  retrieveReservationStatus,
} from './r.actions';
import { ReservationState } from './r.state';

export const initialState: ReservationState = {
  itemid: null,
  status: 'unknown',
  errorText: null,
};

export const rReducer = createReducer<ReservationState>(
  initialState,
  on(
    retrieveReservationStatus,
    (state, p): ReservationState => ({
      ...state,
      errorText: '',
      itemid: p.itemId,
      status: 'requestPending',
    })
  ),
  on(
    reservationStatusResponse,
    (state, p): ReservationState => ({
      ...state,
      errorText: '',
      itemid: p.itemId,
      status: p.status,
    })
  ),
  on(
    setActiveItem,
    (state, p): ReservationState => ({
      ...state,
      errorText: '',
      itemid: p.item?.id || null,
      status: 'unknown',
    })
  )
);
