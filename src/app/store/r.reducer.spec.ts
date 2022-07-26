import { appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { randomNumber, randomString } from 'testing/utils';
import { WishlistItem } from '../business/item';
import { retrieveReservationStatus } from './r.actions';
import { rReducer } from './r.reducer';
import { ReservationState } from './r.state';
import { setActiveItem } from './w.actions';

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

    it('should clear error text to `requestPending`', () => {
      // Assert
      expect(newstate.errorText).toBe('');
    });
  });
});
