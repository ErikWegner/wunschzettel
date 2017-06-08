export class Category {
  public static allItemsCategory(): Category {
    let c = new Category('Alle Einträge');
    c.filter = '*';
    return c;
  }

  public filter: string;

  constructor(public name: string) {
    this.filter = name;
  }

  public equals(other: Category): boolean {
    return this.name === other.name;
  }
}
