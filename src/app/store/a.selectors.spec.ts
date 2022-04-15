import { AppStateBuilder } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';
import { selectHasPendingRequest, selectRequestErrorText } from './a.selectors';
import { AppState } from './app.state';

describe('AppGlobalState selectors', () => {
  afterEach(() => {
    selectHasPendingRequest.release();
  });

  const initialState: AppState = AppStateBuilder.givenCategories(
    'Book',
    'Game',
    'Everything else'
  );

  [true, false].forEach((testValue) => {
    it('should select the value ' + testValue, () => {
      initialState.ag.pendingRequest = testValue;
      const result = selectHasPendingRequest.projector(initialState.ag);
      expect(result).toEqual(testValue);
    });
  });

  it('should select error text', () => {
    const randomErrorText = randomString(25, 'Server error ');
    initialState.ag.requestErrorText = randomErrorText;
    const result = selectRequestErrorText.projector(initialState.ag);
    expect(result).toBe(randomErrorText);
  });
});
