export class Category {
  constructor(public readonly value: string) { }

  public static readonly Unspecified = new Category(null);
}
