import { createReducer, on } from '@ngrx/store';
import { AppGlobalState } from './a.state';
import { getItems, itemsLoaded } from './w.actions';

export const initialState: AppGlobalState = {
  pendingRequest: true,
  requestErrorText: null,
};

export const agReducer = createReducer<AppGlobalState>(
  initialState,
  on(
    getItems,
    (state, _p): AppGlobalState => ({
      ...state,
      pendingRequest: true,
    })
  ),
  on(
    itemsLoaded,
    (state, _p): AppGlobalState => ({
      ...state,
      pendingRequest: false,
    })
  )
);
