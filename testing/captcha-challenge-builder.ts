import { CaptchaChallenge } from 'src/app/domain';
import { TestRandom } from './test-random';

export class CaptchaChallengeBuilder {
    private textValue = TestRandom.randomString(8, 'text-');
    private hintValue = TestRandom.randomString(6, 'hint-');

    public static default() {
        return CaptchaChallengeBuilder.with().build();
    }

    public static with() {
        return new CaptchaChallengeBuilder();
    }

    public build() {
        return new CaptchaChallenge(this.textValue, this.hintValue);
    }

    public text(text: string) {
        this.textValue = text;
        return this;
    }
}
