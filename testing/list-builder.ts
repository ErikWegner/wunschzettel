export class ListBuilder<T> {
  private count = 1;

  static with<T>(generator: (index: number) => T): ListBuilder<T> {
    return new ListBuilder(generator);
  }

  constructor(private generator: (index: number) => T) { }

  public items(count: number): ListBuilder<T> {
    this.count = count;
    return this;
  }

  public build(): T[] {
    const r = [];
    for (let i = 0; i < this.count; i++) {
      r.push(this.generator(i));
    }

    return r;
  }
}
