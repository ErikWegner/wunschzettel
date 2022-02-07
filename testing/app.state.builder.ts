import { AppGlobalState } from 'src/app/store/a.state';
import { AppState } from 'src/app/store/app.state';
import { WishlistState } from 'src/app/store/w.state';

export const appStateStub = (): AppStateBuilder => new AppStateBuilder();

export class AppStateBuilder implements AppState {
  ag: AppGlobalState = {
    loading: false,
  };
  wishlist: WishlistState = {
    categories: [],
    items: [],
  };
}
