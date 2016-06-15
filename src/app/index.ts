// App
export * from './app.component';
export * from './service';

import { WunschzettelService } from './service';

// Application wide providers
export const APP_PROVIDERS = [
  WunschzettelService
];
