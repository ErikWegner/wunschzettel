export enum CaptchaState {
    /**
     * Loading the captcha challenge
     */
    Loading,
  
    /**
     * Waiting for user to input captcha response
     */
    WaitingForUserInput,
  
    /**
     * Sending changes to the server
     */
    Submitting,
  
    /**
     * Data was successfully transmitted
     */
    Success,
  
    /**
     * An error occurred during transmission
     */
    Fail,
  
    /**
     * An error occurred while setting the state, e.g. captcha wrong or state mismatch
     */
    Error
  }
    