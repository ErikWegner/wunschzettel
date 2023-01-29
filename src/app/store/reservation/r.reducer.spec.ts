import { WishlistItem } from 'src/app/business/item';
import { appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { randomNumber, randomString } from 'testing/utils';
import { setActiveItem } from '../w.actions';
import {
  reservationStatusResponse,
  retrieveReservationStatus,
} from './r.actions';
import { rReducer } from './r.reducer';
import { ReservationState, ReservationStatus } from './r.state';

describe('Reservation reducer', () => {
  describe('setActiveItem', () => {
    let item: WishlistItem;
    let newstate: ReservationState;

    beforeEach(() => {
      // Arrange
      const initialState = appStateStub();
      initialState.reservation.itemid = -randomNumber(40);
      initialState.reservation.errorText = randomString(
        20,
        'Old error message'
      );
      initialState.reservation.status = 'reserved';
      item = WishlistItemBuilder.default();

      const action = setActiveItem({ item });

      // Act
      newstate = rReducer(initialState.reservation, action);
    });

    it('should set status to `unknown` when active item is set', () => {
      // Assert
      expect(newstate.status).toBe('unknown');
    });

    it('should update item id when active item is set', () => {
      // Assert
      expect(newstate.itemid).toBe(item.id);
    });

    it('should clear error text when active item is set', () => {
      // Assert
      expect(newstate.errorText).toBe('');
    });
  });

  describe('retrieveReservationStatus', () => {
    let itemId: number;
    let newstate: ReservationState;

    beforeEach(() => {
      // Arrange
      const initialState = appStateStub();
      initialState.reservation.itemid = -randomNumber(40);
      initialState.reservation.errorText = randomString(
        20,
        'Old error message'
      );
      initialState.reservation.status = 'unknown';
      itemId = randomNumber(900);

      const action = retrieveReservationStatus({ itemId });

      // Act
      newstate = rReducer(initialState.reservation, action);
    });

    it('should set status to `requestPending`', () => {
      // Assert
      expect(newstate.status).toBe('requestPending');
    });

    it('should update item id', () => {
      // Assert
      expect(newstate.itemid).toBe(itemId);
    });

    it('should clear error text', () => {
      // Assert
      expect(newstate.errorText).toBe('');
    });
  });

  describe('reservationStatusResponse', () => {
    (
      [{ s: 'reserved' }, { s: 'free' }] as Array<{ s: ReservationStatus }>
    ).forEach((testSetup) => {
      describe(testSetup.s, () => {
        let itemId: number;
        let newstate: ReservationState;

        beforeEach(() => {
          // Arrange
          const initialState = appStateStub();
          initialState.reservation.status = 'requestPending';
          initialState.reservation.itemid = -50;
          initialState.reservation.errorText = 'Unrelated old error message';
          itemId = randomNumber(900);

          const action = reservationStatusResponse({
            itemId,
            status: testSetup.s,
            errorText: null,
          });

          // Act
          newstate = rReducer(initialState.reservation, action);
        });

        it('should set status to `' + testSetup.s + '`', () => {
          // Assert
          expect(newstate.status).toBe(testSetup.s);
        });

        it('should update item id', () => {
          // Assert
          expect(newstate.itemid).toBe(itemId);
        });

        it('should clear error text', () => {
          // Assert
          expect(newstate.errorText).toBe('');
        });
      });
    });
  });
});
