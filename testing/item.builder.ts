import { WishlistItem } from 'src/app/business/item';
import { randomNumber, randomString } from './utils';

export class WishlistItemBuilder {
  id = randomNumber(900);
  title = randomString(8, 'title ');
  description = randomString(30, 'description ');
  image_url = randomString(8, 'image ');
  shopping_url = randomString(8, 'shop ');
  category = randomString(8, 'category ');

  static n() {
    return new WishlistItemBuilder();
  }

  static default() {
    return WishlistItemBuilder.n().build();
  }

  static faust(): WishlistItem {
    return {
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
      id: 42_872,
    };
  }

  withCategory(category: string) {
    this.category = category;
    return this;
  }

  withId(id: number) {
    this.id = id;
    return this;
  }

  build(): WishlistItem {
    return {
      id: this.id,
      Title: this.title,
      Description: this.description,
      ImgageUrl: this.image_url,
      BuyUrl: this.shopping_url,
      Category: this.category,
    };
  }
}
