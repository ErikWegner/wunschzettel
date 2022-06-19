import { createReducer, on } from '@ngrx/store';
import { clearFailedRequestAndRetry, requestFailure } from './a.actions';
import { AppGlobalState } from './a.state';
import { getItems, itemsLoaded } from './w.actions';

export const initialState: AppGlobalState = {
  captchaRequest: null,
  pendingRequest: true,
  requestErrorText: null,
  requestRetryAction: null,
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
  ),
  on(
    requestFailure,
    (state, p): AppGlobalState => ({
      ...state,
      pendingRequest: false,
      requestErrorText: p.errorText,
      requestRetryAction: p.retryAction ?? null,
    })
  ),
  on(
    clearFailedRequestAndRetry,
    (state, _): AppGlobalState => ({
      ...state,
      requestErrorText: null,
      requestRetryAction: null,
    })
  )
);
