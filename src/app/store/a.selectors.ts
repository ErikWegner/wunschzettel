import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { AppGlobalState } from './a.state';

export const selectFeature = (state: any) => (state as AppState).ag;

export const selectHasPendingRequest = createSelector(
  selectFeature,
  (state: AppGlobalState) => state.pendingRequest
);

export const selectRequestErrorText = createSelector(
  selectFeature,
  (state: AppGlobalState) => state.requestErrorText
);

export const selectCaptchaRequestText = createSelector(
  selectFeature,
  (state: AppGlobalState) => state.captchaRequest
);
