import { appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { ListBuilder } from 'testing/list-builder';
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
  });
});
