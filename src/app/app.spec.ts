import {
  provide,
  ElementRef
} from '@angular/core';
import {
  beforeEachProviders,
  inject,
  it
} from '@angular/core/testing';

// Load the implementations that should be tested
import { App } from './app.component';

import { WunschzettelService }  from './service';
import { TestMockElementRef, TestMockWunschzettelService } from './testmocks';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    provide(WunschzettelService, { useClass: TestMockWunschzettelService }),
    provide(ElementRef, { useClass: TestMockElementRef }),
    App
  ]);

  it(
    'should query items from service OnInit',
    inject(
      [WunschzettelService, ElementRef, App],
      (exService: TestMockWunschzettelService, e: TestMockElementRef, app: App) => {
        expect(exService.itemsCount).toBe(0);
        app.ngOnInit();
        expect(exService.itemsCount).toBe(1);
      }));
});
