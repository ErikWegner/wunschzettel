import { AppGlobalState } from './a.state';
import { ReservationState } from './r.state';
import { WishlistState } from './w.state';

export interface AppState {
  ag: AppGlobalState;
  wishlist: WishlistState;
  reservation: ReservationState;
}
