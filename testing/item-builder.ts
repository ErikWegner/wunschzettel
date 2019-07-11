import { Item } from 'src/app/domain';
import { TestRandom } from './test-random';
import { ListBuilder } from './list-builder';

const wordBuilder = () => TestRandom.randomString(TestRandom.r(12, 3));
const paragraphBuilder = () => ListBuilder.with(wordBuilder).items(TestRandom.r(200)).build().join(' ');
const multiParagraphBuilder = () => ListBuilder.with(paragraphBuilder).items(TestRandom.r(3, 1)).build().join('\n\n');

export class ItemBuilder {
  private idValue = TestRandom.id('item');
  private titleValue = TestRandom.randomString(13, 'title-');
  private imagesrcValue = '/assets/mockimg.svg';
  private buyurlValue = 'https://ewus.de/contact';
  private categoryValue = TestRandom.randomString(8, 'category-');
  private descriptionValue = multiParagraphBuilder();

  private constructor() {
    if (this.idValue % 2) {
      this.imagesrcValue = '';
    }
  }

  public static with() {
    return new ItemBuilder();
  }

  public static default() {
    return ItemBuilder.with().build();
  }

  static from(item: Item) {
    const instance = new ItemBuilder();
    instance.idValue = item.id;
    instance.titleValue = item.title;
    instance.descriptionValue = item.description;
    instance.categoryValue = item.category;
    instance.imagesrcValue = item.imagesrc;
    instance.buyurlValue = item.buyurl;
    return instance;
  }

  public category(category: string) {
    this.categoryValue = category;
    return this;
  }

  public id(id: number) {
    this.idValue = id;
    return this;
  }

  public title(title: string) {
    this.titleValue = title;
    return this;
  }

  public build() {
    const i = new Item();

    i.id = this.idValue;
    i.title = this.titleValue;
    i.category = this.categoryValue;
    i.imagesrc = this.imagesrcValue;
    i.buyurl = this.buyurlValue;
    i.description = this.descriptionValue;

    return i;
  }
}
