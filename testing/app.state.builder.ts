import { Action } from '@ngrx/store';
import { WishlistItem } from 'src/app/business/item';
import { AppGlobalState } from 'src/app/store/a.state';
import { AppState } from 'src/app/store/app.state';
import { ReservationState, ReservationStatus } from 'src/app/store/r.state';
import { WishlistState } from 'src/app/store/w.state';
import { ListBuilder } from './list-builder';
import { randomString } from './utils';

export const appStateStub = (): AppStateBuilder => new AppStateBuilder();

export class AppStateBuilder implements AppState {
  ag: AppGlobalState = {
    captchaRequest: 'Sieben plus zwei',
    pendingRequest: false,
    requestErrorText: null,
    requestRetryAction: null,
  };
  wishlist: WishlistState = {
    categories: [],
    items: [],
    activeItem: null,
  };
  reservation: ReservationState = {
    itemid: null,
    status: 'unknown',
    errorText: null,
  };

  public static hasError(errorText: string): AppStateBuilder {
    const b = new AppStateBuilder();
    b.ag.requestErrorText = errorText;
    return b;
  }

  public withRetryAction(retryAction: Action): AppStateBuilder {
    this.ag.requestRetryAction = retryAction;
    return this;
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

  public static hasActiveItem(values?: Partial<WishlistItem>): AppStateBuilder {
    const b = new AppStateBuilder();
    return b.withActiveItem(values);
  }

  public static reservationStatus(
    status: ReservationStatus,
    opt?: { errorText?: string }
  ): AppStateBuilder {
    const b = new AppStateBuilder();
    b.reservation.status = status;
    b.reservation.errorText = opt?.errorText || null;
    return b;
  }

  public static withBookCategoryAndItems(): AppStateBuilder {
    const b = AppStateBuilder.givenCategories('Buch')
      .withItem({
        id: 8,
        Title: 'Schillers Glocke',
        Description:
          'Das Lied von der Glocke ist ein im Jahr 1799 von Friedrich Schiller veröffentlichtes Gedicht. Es gehörte lange Zeit zum Kanon der deutschen Literatur und ist eines der bekanntesten, am meisten zitierten und parodierten deutschen Gedichte.',
        BuyUrl: 'https://de.wikipedia.org/wiki/Das_Lied_von_der_Glocke',
        Category: 'Buch',
        ImgageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/6/69/Liezen_Prachteinband_Schillers_Glocke_01.jpg',
      })
      .withItem({
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
        id: 19,
      })
      .withItem({
        id: 41,
        Title: 'Nathan der Weise',
        Description:
          'Nathan der Weise ist der Titel und die Hauptfigur eines fünfaktigen Ideendramas von Gotthold Ephraim Lessing, das 1779 veröffentlicht und am 14. April 1783 in Berlin uraufgeführt wurde. Das Werk hat als Themenschwerpunkte den Humanismus und den Toleranzgedanken der Aufklärung. Besonders berühmt wurde die Ringparabel im dritten Aufzug des Dramas.',
        BuyUrl: 'https://de.wikipedia.org/wiki/Nathan_der_Weise',
        Category: 'Buch',
        ImgageUrl: '',
      });
    return b;
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

  withItem(item: WishlistItem): AppStateBuilder {
    this.wishlist.items.push(item);
    if (!this.wishlist.categories.includes(item.Category)) {
      this.wishlist.categories.push(item.Category);
    }
    return this;
  }

  withTheseItems(items: WishlistItem[]): AppStateBuilder {
    this.wishlist.items.length = 0;
    this.wishlist.categories.length = 0;
    items.forEach((item) => this.withItem(item));
    return this;
  }
}
