import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';
import { clearFailedRequestAndRetry, requestFailure } from './a.actions';
import { agReducer } from './a.reducer';
import { getItems, itemsLoaded } from './w.actions';

describe('AppGlobal reducer', () => {
  describe('getItems', () => {
    it('should set isLoading to true', () => {
      // Arrange
      const initialState = appStateStub();
      initialState.ag.pendingRequest = false;
      const action = getItems();

      // Act
      const newstate = agReducer(initialState.ag, action);

      // Assert
      expect(newstate.pendingRequest).toBeTrue();
    });
  });

  describe('itemsLoaded', () => {
    it('should set isLoading to false', () => {
      // Arrange
      const initialState = appStateStub();
      initialState.ag.pendingRequest = true;
      const action = itemsLoaded({ items: [] });

      // Act
      const newstate = agReducer(initialState.ag, action);

      // Assert
      expect(newstate.pendingRequest).toBeFalse();
    });
  });

  describe('requestFailure', () => {
    it('should set properties', () => {
      // Arrange
      const errorText = randomString(20, 'Error ');
      const retryAction = getItems();
      const initialState = appStateStub();
      initialState.ag.pendingRequest = true;
      initialState.ag.requestErrorText = null;
      initialState.ag.requestRetryAction = null;
      const action = requestFailure({ errorText, retryAction });

      // Act
      const newstate = agReducer(initialState.ag, action);

      // Assert
      expect(newstate.pendingRequest).withContext('pendingRequest').toBeFalse();
      expect(newstate.requestErrorText)
        .withContext('requestErrorText')
        .toBe(errorText);
      expect(newstate.requestRetryAction)
        .withContext('requestRetryAction')
        .toBe(retryAction);
    });
  });

  describe('retryAction', () => {
    it('should clear request error', () => {
      // Arrange
      const errorText = randomString(20, 'Error ');
      const failedAction = getItems();
      const initialState =
        AppStateBuilder.hasError(errorText).withRetryAction(failedAction);
      const action = clearFailedRequestAndRetry({ action: failedAction });

      // Act
      const newstate = agReducer(initialState.ag, action);

      // Assert
      expect(newstate.requestErrorText)
        .withContext('requestErrorText')
        .toBeNull();
      expect(newstate.requestRetryAction)
        .withContext('requestRetryAction')
        .toBeNull();
    });
  });
});
