import { AppGlobalState } from './a.state';
import { WishlistState } from './w.state';

export interface AppState {
  ag: AppGlobalState;
  wishlist: WishlistState;
}
