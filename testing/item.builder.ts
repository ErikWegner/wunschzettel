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
