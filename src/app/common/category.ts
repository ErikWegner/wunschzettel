export class Category {
  public filter: string
  
  constructor(public name: string) {
    this.filter = name;
  }
  
  equals(other: Category): boolean {
    return this.name === other.name;
  }
  
  static allItemsCategory() : Category {
    var c = new Category("Alle Einträge");
    c.filter = "*";
    return c;
  }
}