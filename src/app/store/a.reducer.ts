import { createReducer, on } from '@ngrx/store';
import { AppGlobalState } from './a.state';
import { getItems, itemsLoaded } from './w.actions';

export const initialState: AppGlobalState = {
  loading: true,
};

export const agReducer = createReducer<AppGlobalState>(
  initialState,
  on(
    getItems,
    (state, _p): AppGlobalState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    itemsLoaded,
    (state, _p): AppGlobalState => ({
      ...state,
      loading: false,
    })
  )
);
