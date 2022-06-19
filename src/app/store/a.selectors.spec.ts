import { AppStateBuilder } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';
import {
  selectCaptchaRequestText,
  selectHasPendingRequest,
  selectHasRequestError,
  selectRequestErrorText,
} from './a.selectors';
import { AppState } from './app.state';

describe('AppGlobalState selectors', () => {
  afterEach(() => {
    selectCaptchaRequestText.release();
    selectHasPendingRequest.release();
    selectHasRequestError.release();
    selectRequestErrorText.release();
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

  it('should select captcha request', () => {
    const captchaPuzzleText = randomString(25, 'Solve this ');
    initialState.ag.captchaRequest = captchaPuzzleText;
    const result = selectCaptchaRequestText.projector(initialState.ag);
    expect(result).toBe(captchaPuzzleText);
  });

  [
    {
      testName: 'null',
      inputValue: null,
      expectedResult: false,
    },
    {
      testName: 'empty value',
      inputValue: '',
      expectedResult: false,
    },
    {
      testName: 'positive case',
      inputValue: randomString(20),
      expectedResult: true,
    },
  ].forEach((testsetup) => {
    it(`should handle ${testsetup.testName}`, () => {
      // Arrange
      initialState.ag.requestErrorText = testsetup.inputValue;

      // Act
      const result = selectHasRequestError.projector(initialState.ag);

      // Assert
      expect(result).toBe(testsetup.expectedResult);
    });
  });
});
