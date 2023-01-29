import { RouterReducerState } from '@ngrx/router-store';
import { AppGlobalState } from './a.state';
import { CaptchaState } from './captcha';
import { ReservationState } from './reservation/r.state';
import { RouterStateUrl } from './router/custom-route-serializer';
import { WishlistState } from './w.state';

export interface AppState {
  ag: AppGlobalState;
  wishlist: WishlistState;
  reservation: ReservationState;
  router: RouterReducerState<RouterStateUrl>;
  captcha: CaptchaState;
}
