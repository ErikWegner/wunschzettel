import { appStateStub } from 'testing/app.state.builder';
import { agReducer } from './a.reducer';
import { getItems, itemsLoaded } from './w.actions';

describe('AppGlobal reducer', () => {
  describe('getItems', () => {
    it('should set isLoading to true', () => {
      // Arrange
      const initialState = appStateStub();
      initialState.ag.loading = false;
      const action = getItems();

      // Act
      const newstate = agReducer(initialState.ag, action);

      // Assert
      expect(newstate.loading).toBeTrue();
    });
  });
  describe('itemsLoaded', () => {
    it('should set isLoading to false', () => {
      // Arrange
      const initialState = appStateStub();
      initialState.ag.loading = true;
      const action = itemsLoaded({ items: [] });

      // Act
      const newstate = agReducer(initialState.ag, action);

      // Assert
      expect(newstate.loading).toBeFalse();
    });
  });
});
