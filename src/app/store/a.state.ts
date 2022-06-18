import { Action } from '@ngrx/store';

export interface AppGlobalState {
  pendingRequest: boolean;
  requestErrorText: string | null;
  requestRetryAction: Action | null;
  captchaRequest: string | null;
}
