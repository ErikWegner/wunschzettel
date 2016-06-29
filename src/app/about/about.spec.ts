import { TestComponentBuilder } from '@angular/compiler/testing';
import { provide, Component, ElementRef } from '@angular/core';
import {
  beforeEachProviders,
  describe,
  inject,
  injectAsync,
  it
} from '@angular/core/testing';

// Load the implementations that should be tested
import { About } from './about.component';
import { TestMockElementRef } from '../testmocks';

describe('About', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    provide(ElementRef, { useClass: TestMockElementRef }),
    About
  ]);


});
