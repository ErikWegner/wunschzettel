import { CaptchaChallenge } from './captcha-challenge';
import { TestRandom } from 'testing';

describe('CaptchaChallenge', () => {
  it('should create an instance', () => {
    const t = TestRandom.randomString(25);
    expect(new CaptchaChallenge(t)).toBeTruthy();
  });
});
