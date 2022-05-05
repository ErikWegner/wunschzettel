import { WishlistItemBuilder } from 'testing/item.builder';
import { ListBuilder } from 'testing/list-builder';
import { randomNumber } from 'testing/utils';
import { WithCategoryPipe } from './with-category.pipe';

describe('WithCategoryPipe', () => {
  it('create an instance', () => {
    const pipe = new WithCategoryPipe();
    expect(pipe).toBeTruthy();
  });

  it('handles null', () => {
    const pipe = new WithCategoryPipe();
    const result = pipe.transform(null, null);
    expect(result).toEqual([]);
  });

  it('returns all items when category is null', () => {
    const count = randomNumber(10, 5);
    const pipe = new WithCategoryPipe();
    const items = ListBuilder.with(() => WishlistItemBuilder.default())
      .items(count)
      .build();
    const result = pipe.transform(items, null);
    expect(result).toEqual(items);
  });

  it('returns filtered items', () => {
    const r = randomNumber(10, 4);
    const s = randomNumber(8, 3);
    const pipe = new WithCategoryPipe();
    const items = ListBuilder.with((i) =>
      WishlistItemBuilder.n()
        .withCategory(i % r === 0 ? 't' : 'f')
        .build()
    )
      .items(s * r)
      .build();
    const result = pipe.transform(items, 't');
    expect(result.length).toEqual(s);
  });
});
