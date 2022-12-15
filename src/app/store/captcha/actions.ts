import { createAction, props } from '@ngrx/store';

export const getCaptchaChallenge = createAction('[Captcha] Get challenge');

export const captchaChallengeReceived = createAction(
  '[Captcha] Captcha challenge received',
  props<{ captchaTask: string }>()
);

export const captchaChallengeError = createAction(
  '[Captcha] Captcha challenge error',
  props<{ errorText: string }>()
);
