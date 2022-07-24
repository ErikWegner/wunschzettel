import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { filter, map } from 'rxjs';
import { navigatedToItem } from './actions';
import { RouterStateUrl } from './custom-route-serializer';

interface RouterNavigatedPayload {
  payload: { routerState: RouterStateUrl };
}

@Injectable()
export class RouterEffects {
  navigationToItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (p: RouterNavigatedPayload) =>
          p.payload.routerState.data['action'] == 'navigatedToItem'
      ),
      map((p: RouterNavigatedPayload) => {
        return navigatedToItem({
          itemId: parseInt(p.payload.routerState.params['wunsch'] || '0'),
        });
      })
    );
  });

  constructor(private actions$: Actions) {}
}
