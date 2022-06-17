import { Action, createAction, props } from '@ngrx/store';

export const requestFailure = createAction(
  '[W] Request requestFailure',
  props<{
    errorText: string;
    errorDetails?: string;
    retryAction?: Action;
  }>()
);
