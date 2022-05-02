import { appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { ListBuilder } from 'testing/list-builder';
import { randomNumber } from 'testing/utils';
import { itemsLoaded } from './w.actions';
import { wReducer } from './w.reducer';

describe('Wishlist reducer', () => {
  describe('itemsLoaded', () => {
    it('should update categories', () => {
      // Arrange
      const items = ListBuilder.with((i) =>
        WishlistItemBuilder.n()
          .withCategory(`Category ${i % 3}`)
          .build()
      )
        .items(10)
        .build();
      const initialState = appStateStub();
      const action = itemsLoaded({
        items,
      });

      // Act
      const newstate = wReducer(initialState.wishlist, action);

      // Assert
      expect(newstate.categories).toEqual([
        'Category 0',
        'Category 1',
        'Category 2',
      ]);
    });

    it('should set items', () => {
      // Arrange
      const itemCount = randomNumber(19, 8);
      const items = ListBuilder.with((i) => WishlistItemBuilder.default())
        .items(itemCount)
        .build();
      const initialState = appStateStub();
      const action = itemsLoaded({
        items,
      });

      // Act
      const newstate = wReducer(initialState.wishlist, action);

      // Assert
      expect(newstate.items).not.toBeNull();
      expect(newstate.items.length).toBe(itemCount);
      expect(newstate.items).toEqual(items);
    });
  });
});
