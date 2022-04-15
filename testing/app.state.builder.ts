import { WishlistItem } from 'src/app/business/item';
import { AppGlobalState } from 'src/app/store/a.state';
import { AppState } from 'src/app/store/app.state';
import { WishlistState } from 'src/app/store/w.state';
import { ListBuilder } from './list-builder';
import { randomString } from './utils';

export const appStateStub = (): AppStateBuilder => new AppStateBuilder();

export class AppStateBuilder implements AppState {
  ag: AppGlobalState = {
    pendingRequest: false,
    requestErrorText: null,
    captchaRequest: 'Sieben plus zwei',
  };
  wishlist: WishlistState = {
    categories: [],
    items: [],
    activeItem: null,
  };

  public static hasError(errorText: string): any {
    const b = new AppStateBuilder();
    b.ag.requestErrorText = errorText;
    return b;
  }

  public static givenCategories(...categories: string[]): AppStateBuilder {
    const b = new AppStateBuilder();
    b.wishlist.categories = [...categories];
    return b;
  }

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

  static hasActiveItem(values?: Partial<WishlistItem>): AppStateBuilder {
    const b = new AppStateBuilder();
    return b.withActiveItem(values);
  }

  withActiveItem(values?: Partial<WishlistItem>): AppStateBuilder {
    this.wishlist.activeItem = {
      Title: 'Faust I + II',
      Category: 'Buch',
      Description: `Mit Goethes Faust wird Johann Wolfgang von Goethes Bearbeitung des
      Fauststoffs bezeichnet. Der Begriff kann sich auf den ersten Teil der
      durch Goethe geschaffenen Tragödie, auf deren ersten und zweiten Teil
      gemeinsam oder insgesamt auf die Arbeiten am Fauststoff beziehen, die
      Goethe durch sechzig Jahre hindurch immer wieder neu aufnahm. Er umfasst
      in diesem letzteren Sinne auch die Entwürfe, Fragmente, Kommentare und
      Paralipomena des Dichters zu seinem Faustwerk und zum Fauststoff.`,
      BuyUrl: 'https://de.wikipedia.org/wiki/Goethes_Faust',
      ImgageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kersting_-_Faust_im_Studierzimmer.jpg/220px-Kersting_-_Faust_im_Studierzimmer.jpg',
      id: 1,
      ...values,
    };
    return this;
  }

  withCaptcha(challenge: string): AppStateBuilder {
    this.ag.captchaRequest = challenge;
    return this;
  }
}
