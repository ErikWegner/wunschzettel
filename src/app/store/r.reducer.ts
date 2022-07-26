import { createReducer, on } from '@ngrx/store';
import { retrieveReservationStatus } from './r.actions';
import { ReservationState } from './r.state';
import { setActiveItem } from './w.actions';

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
    setActiveItem,
    (state, p): ReservationState => ({
      ...state,
      errorText: '',
      itemid: p.item?.id || null,
      status: 'unknown',
    })
  )
);
