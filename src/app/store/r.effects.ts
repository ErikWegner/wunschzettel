import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { ItemsService } from '../services/items.service';
import {
  reservationStatusResponse,
  retrieveReservationStatus,
} from './r.actions';

@Injectable()
export class ReservationEffects {
  loadStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(retrieveReservationStatus),
      switchMap((p) =>
        this.itemsService.getReservationFlag(p.itemId).pipe(
          map((reservedFlag) =>
            reservationStatusResponse({
              itemId: p.itemId,
              status: reservedFlag ? 'reserved' : 'free',
              errorText: null,
            })
          )
        )
      )
    );
  });

  constructor(private actions$: Actions, private itemsService: ItemsService) {}
}
