import { TestBed } from "@angular/core/testing";
import { EffectsModule, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { ItemsService } from '../services/items.service';
import { getItems } from './w.actions';
import { WishlistEffects } from './w.effects';
import { initialState as WishlishInitialState } from './w.reducer';

describe('WishlistEffects', () => {
  let actions$: Observable<Action>;
  let effects: WishlistEffects;
  let store: MockStore;
  const initialState = WishlishInitialState;
  let itemsService: jasmine.SpyObj<ItemsService>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    const itemsServiceMock = jasmine.createSpyObj('ItemsService', ['getItems']);

    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([WishlistEffects])],
      providers: [
        {
          provide: ItemsService,
          useValue: itemsServiceMock,
        },
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ],
    });

    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
    itemsService.getItems.and.returnValue(of([]));
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
  });
});
