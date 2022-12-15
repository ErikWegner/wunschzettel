import { createReducer, on } from '@ngrx/store';
import {
  captchaChallengeError,
  captchaChallengeReceived,
  getCaptchaChallenge,
} from './actions';
import { CaptchaState, initialCaptchaState } from './state';

export const captchaReducer = createReducer(
  initialCaptchaState,
  on(
    getCaptchaChallenge,
    (_state, _): CaptchaState => ({
      challenge: '',
      errorText: '',
      loading: true,
    })
  ),
  on(
    captchaChallengeReceived,
    (_state, action): CaptchaState => ({
      challenge: action.captchaTask,
      errorText: '',
      loading: false,
    })
  ),
  on(
    captchaChallengeError,
    (_stte, action): CaptchaState => ({
      challenge: '',
      errorText: action.errorText,
      loading: false,
    })
  )
);
