import { AppGlobalState } from 'src/app/store/a.state';
import { AppState } from 'src/app/store/app.state';
import { WishlistState } from 'src/app/store/w.state';
import { ListBuilder } from './list-builder';
import { randomString } from './utils';

export const appStateStub = (): AppStateBuilder => new AppStateBuilder();

export class AppStateBuilder implements AppState {
  ag: AppGlobalState = {
    pendingRequest: false,
  };
  wishlist: WishlistState = {
    categories: [],
    items: [],
    activeItem: null,
  };

  public static someCategories(): AppStateBuilder {
    const b = new AppStateBuilder();
    b.wishlist.categories = ListBuilder.with((i) =>
      randomString(8, 'Category ')
    )
      .items(7)
      .build();
    return b;
  }

  public static pendingRequest(): AppStateBuilder {
    const b = new AppStateBuilder();
    b.ag.pendingRequest = true;
    return b;
  }
}
