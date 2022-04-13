import { selectHasPendingRequest } from './a.selectors';
import { AppState } from './app.state';

describe('AppGlobalState selectors', () => {
  afterEach(() => {
    selectHasPendingRequest.release();
  });

  const initialState: AppState = {
    ag: { pendingRequest: false },
    wishlist: {
      categories: ['Book', 'Game', 'Everything else'],
      items: [],
      activeItem: null,
    },
  };

  [true, false].forEach((testValue) => {
    it('should select the value ' + testValue, () => {
      initialState.ag.pendingRequest = testValue;
      const result = selectHasPendingRequest.projector(initialState.ag);
      expect(result).toEqual(testValue);
    });
  });
});
