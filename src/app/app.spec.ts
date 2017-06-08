import {
  ElementRef
} from '@angular/core';
import {
  inject
} from '@angular/core/testing';

// Load the implementations that should be tested
import { AppComponent } from './app.component';

import { WunschzettelService }  from './service';
import { TestMockElementRef, TestMockWunschzettelService } from './testmocks';
import { TestBed } from '@angular/core/testing';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: WunschzettelService, useClass: TestMockWunschzettelService},
        {provide: ElementRef, useClass: TestMockElementRef},
      ]
    });
  });

  it(
    'should query items from service OnInit',
    inject(
      [WunschzettelService, ElementRef, AppComponent],
      (exService: TestMockWunschzettelService, e: TestMockElementRef, app: AppComponent) => {
        expect(exService.itemsCount).toBe(0);
        app.ngOnInit();
        expect(exService.itemsCount).toBe(1);
      }));
});
