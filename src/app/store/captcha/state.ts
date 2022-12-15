export interface CaptchaState {
  challenge: string;
  loading: boolean;
  errorText: string;
}

export const initialCaptchaState: CaptchaState = {
  challenge: '',
  loading: false,
  errorText: '',
};
