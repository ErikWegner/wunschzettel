export interface AppGlobalState {
  pendingRequest: boolean;
  requestErrorText: string | null;
  captchaRequest: string | null;
}
