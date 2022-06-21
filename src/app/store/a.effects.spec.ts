import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { appStateStub } from 'testing/app.state.builder';
import { clearFailedRequestAndRetry } from './a.actions';
import { AppGlobalStateEffects } from './a.effects';
import { getItems } from './w.actions';

describe('AppGlobalStateEffects', () => {
  let actions$: Observable<Action>;
  let effects: AppGlobalStateEffects;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([AppGlobalStateEffects])],
      providers: [
        provideMockStore({ initialState: appStateStub() }),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AppGlobalStateEffects);
  });

  it('should dispatch action', () => {
    // Arrange
    const next = jasmine.createSpy('next');
    const failedAction = getItems();
    actions$ = of(clearFailedRequestAndRetry({ action: failedAction }));

    // Act
    effects.retry$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledOnceWith(failedAction);
  });
});
