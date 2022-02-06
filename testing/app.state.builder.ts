import { AppState } from 'src/app/store/app.state';
import { WishlistState } from 'src/app/store/w.state';

export const appStateStub = (): AppStateBuilder => new AppStateBuilder();

export class AppStateBuilder implements AppState {
  wishlist: WishlistState = {
    categories: [],
    items: [],
  };
}
