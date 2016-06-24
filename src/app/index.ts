// App
export * from './app.component';
export * from './service';

import { WunschzettelService } from './service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';


// Application wide providers
export const APP_PROVIDERS = [
  BaseRequestOptions,
  MockBackend,
  {
    provide: Http, useFactory: (backend, options) => {
      return new Http(backend, options);
    }, deps: [MockBackend, BaseRequestOptions]
  },
  WunschzettelService
];
