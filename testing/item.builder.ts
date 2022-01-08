import { WishlistItem } from 'src/app/business/item';
import { randomNumber, randomString } from './utils';

export class WishlistItemBuilder {
  id = randomNumber(900);
  title = randomString(8, 'title ');
  description = randomString(30, 'description ');
  image_url = randomString(8, 'image ');
  shopping_url = randomString(8, 'shop ');
  category = randomString(8, 'category ');

  static default() {
    return new WishlistItemBuilder().build();
  }
  build(): WishlistItem {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_url: this.image_url,
      shopping_url: this.shopping_url,
      category: this.category,
    };
  }
}
