export class Category {
  public filter: string;

  static allItemsCategory(): Category {
    let c = new Category('Alle Einträge');
    c.filter = '*';
    return c;
  }

  constructor(public name: string) {
    this.filter = name;
  }

  equals(other: Category): boolean {
    return this.name === other.name;
  }
}
