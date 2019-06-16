import { Item } from 'src/app/domain';
import { TestRandom } from './test-random';
import { ListBuilder } from './list-builder';

export class ItemBuilder {
  private idValue = TestRandom.id('item');
  private titleValue = TestRandom.randomString(13, 'title-');
  private imagesrcValue = 'https://loremflickr.com/320/240?random=' + TestRandom.id('imagesrc');
  private categoryValue = TestRandom.randomString(8, 'category-');
  private descriptionValue = ListBuilder.with(
    () => TestRandom.randomString(TestRandom.r(12, 3))
  ).items(TestRandom.r(400)).build().join(' ');
  private isReservedValue = false;

  private constructor() {
    this.isReservedValue = (this.idValue % 2) === 0;
  }

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

  public reservedStatus(status: boolean) {
    this.isReservedValue = status;
    return this;
  }

  public build() {
    const i = new Item();

    i.id = this.idValue;
    i.title = this.titleValue;
    i.category = this.categoryValue;
    i.imagesrc = this.imagesrcValue;
    i.description = this.descriptionValue;
    i.isReserved = this.isReservedValue;

    return i;
  }
}
