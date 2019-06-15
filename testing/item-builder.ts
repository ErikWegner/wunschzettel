import { Item } from 'src/app/domain';
import { TestRandom } from './test-random';

export class ItemBuilder {
  private idValue = TestRandom.id('item');
  private categoryValue = TestRandom.randomString(8);

  private constructor() { }

  public static with() {
    return new ItemBuilder();
  }

  public static default() {
    return ItemBuilder.with().build();
  }

  public category(category: string) {
    this.categoryValue = category;
    return this;
  }

  public build() {
    const i = new Item();

    i.id = this.idValue;
    i.category = this.categoryValue;

    return i;
  }
}
