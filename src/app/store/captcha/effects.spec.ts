import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NEVER, Observable, of } from 'rxjs';

import { Result } from 'src/app/business/result';
import { ItemsService } from 'src/app/services/items.service';
import { appStateStub } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';
import {
  captchaChallengeError,
  captchaChallengeReceived,
  getCaptchaChallenge,
} from './actions';

import { CaptchaEffects } from './effects';

describe('CaptchaEffects', () => {
  let actions$: Observable<Action>;
  let effects: CaptchaEffects;
  let itemsService: jasmine.SpyObj<ItemsService>;
  let store: MockStore;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    const itemsServiceMock = jasmine.createSpyObj('ItemsService', [
      'getCaptchaChallenge',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CaptchaEffects,
        {
          provide: ItemsService,
          useValue: itemsServiceMock,
        },
        provideMockStore({ initialState: appStateStub() }),
        provideMockActions(() => actions$),
      ],
    });
    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
    itemsService.getCaptchaChallenge.and.returnValue(NEVER);
    effects = TestBed.inject(CaptchaEffects);
    store = TestBed.inject(MockStore);
  });

  it('should call service and dispatch new task', () => {
    // Arrange
    const next = jasmine.createSpy('next');
    const captchaTask = randomString(6, 'captcha: ');
    itemsService.getCaptchaChallenge.and.returnValue(
      of(new Result(captchaTask))
    );
    actions$ = of(getCaptchaChallenge());

    // Act
    effects.retrieveNewCaptcha$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledOnceWith(
      captchaChallengeReceived({ captchaTask })
    );
  });

  it('should call service and dispatch some error text', () => {
    // Arrange
    const next = jasmine.createSpy('next');
    itemsService.getCaptchaChallenge.and.callFake(() => {
      throw new Error('Not enough bandwidth');
    });
    actions$ = of(getCaptchaChallenge());

    // Act
    effects.retrieveNewCaptcha$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledOnceWith(
      captchaChallengeError({ errorText: 'Fehler beim Abruf' })
    );
  });

  it('should call service and map result', () => {
    // Arrange
    const next = jasmine.createSpy('next');
    itemsService.getCaptchaChallenge.and.returnValue(of(new Result('', false)));
    actions$ = of(getCaptchaChallenge());

    // Act
    effects.retrieveNewCaptcha$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledOnceWith(
      captchaChallengeError({ errorText: 'Fehler beim Abruf' })
    );
  });
});
