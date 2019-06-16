import { Item } from 'src/app/domain';
import { TestRandom } from './test-random';

export class ItemBuilder {
  private idValue = TestRandom.id('item');
  private titleValue = TestRandom.randomString(13, 'title-');
  private categoryValue = TestRandom.randomString(8, 'category-');

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

  public id(id: number) {
    this.idValue = id;
    return this;
  }

  public build() {
    const i = new Item();

    i.id = this.idValue;
    i.title = this.titleValue;
    i.category = this.categoryValue;

    return i;
  }
}
