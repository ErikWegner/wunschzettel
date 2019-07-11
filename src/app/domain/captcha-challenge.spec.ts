import { CaptchaChallenge } from './captcha-challenge';
import { TestRandom } from 'testing';

describe('CaptchaChallenge', () => {
  it('should create an instance', () => {
    const t = TestRandom.randomString(25);
    const h = TestRandom.randomString(26);
    expect(new CaptchaChallenge(t, h)).toBeTruthy();
  });
});
