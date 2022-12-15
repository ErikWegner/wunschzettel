import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CaptchaState } from './state';

export const selectFeature = (state: AppState) => state.captcha;

export const selectCaptchaLoading = createSelector(
  selectFeature,
  (state: CaptchaState) => state.loading
);

export const selectCaptchaTask = createSelector(
  selectFeature,
  (state: CaptchaState) => state.challenge
);

export const selectCaptchaError = createSelector(
  selectFeature,
  (state: CaptchaState) => state.errorText
);
