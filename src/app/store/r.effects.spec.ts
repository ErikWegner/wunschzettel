import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { appStateStub } from 'testing/app.state.builder';
import { randomNumber } from 'testing/utils';
import { ItemsService } from '../services/items.service';
import {
  reservationStatusResponse,
  retrieveReservationStatus,
} from './r.actions';
import { ReservationEffects } from './r.effects';
import { ReservationStatus } from './r.state';

describe('Reservation effects', () => {
  let actions$: Observable<Action>;
  let effects: ReservationEffects;
  let itemsService: jasmine.SpyObj<ItemsService>;

  beforeEach(() => {
    actions$ = new Observable();
    const itemsServiceMock = jasmine.createSpyObj('ItemsService', [
      'getReservationFlag',
    ]);
    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([ReservationEffects])],
      providers: [
        {
          provide: ItemsService,
          useValue: itemsServiceMock,
        },
        provideMockStore({ initialState: appStateStub() }),
        provideMockActions(() => actions$),
      ],
    });

    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
    effects = TestBed.inject(ReservationEffects);
  });

  it('should request reservation status and dispatch reserved result', () => {
    // Arrange
    const itemId = randomNumber(900);
    const status: ReservationStatus = 'reserved';
    actions$ = of(retrieveReservationStatus({ itemId }));
    itemsService.getReservationFlag.and.returnValue(of(true));

    // Act + Assert
    const expected = cold('(a|)', {
      a: reservationStatusResponse({ itemId, status, errorText: null }),
    });
    expect(effects.loadStatus$).toBeObservable(expected);
  });

  it('should request reservation status and dispatch free result', () => {
    // Arrange
    const itemId = randomNumber(900);
    const status: ReservationStatus = 'free';
    actions$ = of(retrieveReservationStatus({ itemId }));
    itemsService.getReservationFlag.and.returnValue(of(false));

    // Act + Assert
    const expected = cold('(a|)', {
      a: reservationStatusResponse({ itemId, status, errorText: null }),
    });
    expect(effects.loadStatus$).toBeObservable(expected);
  });
});
