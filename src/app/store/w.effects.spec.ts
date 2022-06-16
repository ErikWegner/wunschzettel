import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EffectsModule, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { randomNumber, randomString } from 'testing/utils';
import { ItemsService } from '../services/items.service';
import { getItems, goToCategory, goToItem, requestFailure } from './w.actions';
import { WishlistEffects } from './w.effects';
import { initialState as WishlishInitialState } from './w.reducer';

describe('WishlistEffects', () => {
  let actions$: Observable<Action>;
  let effects: WishlistEffects;
  let store: MockStore;
  const initialState = WishlishInitialState;
  let itemsService: jasmine.SpyObj<ItemsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    const itemsServiceMock = jasmine.createSpyObj('ItemsService', ['getItems']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([WishlistEffects])],
      providers: [
        {
          provide: ItemsService,
          useValue: itemsServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ],
    });

    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
    itemsService.getItems.and.returnValue(of([]));
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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

  it('should navigate to category page', () => {
    // Arrange
    const categoryName = randomString(12, 'category-');
    actions$ = of(goToCategory({ category: categoryName }));

    // Act
    effects.navigateToCategory$.subscribe();

    // Assert
    expect(router.navigate).toHaveBeenCalledOnceWith([
      '/wunschliste',
      categoryName,
    ]);
  });

  it('should navigate to item', () => {
    // Arrange
    const itemId = randomNumber(100, 20);
    actions$ = of(goToItem({ itemId }));

    // Act
    effects.navigateToItem$.subscribe();

    // Assert
    expect(router.navigate).toHaveBeenCalledOnceWith(['/wunsch', itemId + '']);
  });

  it('should handle error when loading items', () => {
    // Arrange
    const next = jasmine.createSpy('next');
    const action = getItems();
    actions$ = of(action);
    itemsService.getItems.and.callFake(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            url: 'http://127.0.0.1/service.php?action=list',
            error: 'Error occurred: 127.0.0.1/service.php?action=list',
          })
      )
    );

    // Act
    effects.getItems$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledWith(
      requestFailure({
        errorText: 'Fehler beim Laden der Einträge',
        errorDetails:
          'Http failure response for http://127.0.0.1/service.php?action=list: 500 Internal Server Error',
        retryAction: action,
      })
    );
  });
});
