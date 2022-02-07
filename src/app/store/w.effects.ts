import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { map, switchMap } from 'rxjs';
import { ItemsService } from '../services/items.service';
import { getItems, itemsLoaded } from './w.actions';

@Injectable()
export class WishlistEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map((_) => getItems())
    );
  });

  getItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getItems),
      switchMap((_) =>
        this.itemsService
          .getItems()
          .pipe(map((items) => itemsLoaded({ items })))
      )
    );
  });

  constructor(private actions$: Actions, private itemsService: ItemsService) {}
}
