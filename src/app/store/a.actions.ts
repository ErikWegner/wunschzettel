import { Action, createAction, props } from '@ngrx/store';

export const requestFailure = createAction(
  '[A] Request requestFailure',
  props<{
    errorText: string;
    errorDetails?: string;
    retryAction?: Action;
  }>()
);

export const clearFailedRequestAndRetry = createAction(
  '[A] Retry action',
  props<{
    action: Action;
  }>()
);
