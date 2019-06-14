import { Item } from 'src/app/domain';

export class ItemBuilder {
  private categoryValue = '';

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

    i.Category = this.categoryValue;

    return i;
  }
}
