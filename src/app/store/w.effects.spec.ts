import { TestBed } from "@angular/core/testing";
import { EffectsModule, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, createAction } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { WishlistEffects } from "./w.effects";
import { hot } from 'jasmine-marbles';
import { getItems } from "./w.actions";
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState as WishlishInitialState } from "./w.reducer";

describe('WishlistEffects', () => {
  let actions$: Observable<Action>;
  let effects: WishlistEffects;
  let store: MockStore;
  const initialState = WishlishInitialState;

  beforeEach(() => {
    actions$ = new Observable<Action>();

    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([WishlistEffects])],
      providers: [
        provideMockStore({ initialState }), provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(WishlistEffects);
    store = TestBed.inject(MockStore);
  });

  it('should trigger load action on initializing', () => {
    // Arrange
    actions$ = of({ type: ROOT_EFFECTS_INIT });
    const next = jasmine.createSpy('next');

    // Act
    effects.init$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledWith(getItems());
  })
});
