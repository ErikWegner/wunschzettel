import { AppState } from './app.state';
import { selectCategories } from './w.selectors';

describe('Wishlist selectors', () => {
  const initialState: AppState = {
    ag: { pendingRequest: false },
    wishlist: {
      categories: ['Book', 'Game', 'Everything else'],
      items: [],
      activeItem: null,
    },
  };

  it('should select the categories', () => {
    const result = selectCategories.projector(initialState.wishlist);
    expect(result.length).toEqual(3);
    expect(result[1]).toEqual('Game');
  });
});
