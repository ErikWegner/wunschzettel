import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ItemsService } from '../services/items.service';
import { requestFailure } from './a.actions';
import {
  getItems,
  goToCategory,
  goToItem,
  itemsLoaded,
  setActiveItem,
} from './w.actions';
import { selectItems } from './w.selectors';

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
      switchMap((initialAction) =>
        this.itemsService.getItems().pipe(
          map((items) => itemsLoaded({ items })),
          catchError((err) => {
            return of(
              requestFailure({
                errorText: 'Fehler beim Laden der Einträge',
                errorDetails: err.message,
                retryAction: initialAction,
              })
            );
          })
        )
      )
    );
  });

  navigateToCategory$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(goToCategory),
        tap((d) => {
          this.router.navigate(['/wunschliste', d.category]);
        })
      );
    },
    { dispatch: false }
  );

  navigateToItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(goToItem),
      mergeMap((action) =>
        this.store.select(selectItems).pipe(
          map((items) => {
            const itemId = action.itemId;
            const item = items?.find((i) => i.id == itemId);
            this.router.navigate(['/wunsch', `${itemId}`]);
            return setActiveItem({ item });
          })
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private itemsService: ItemsService,
    private router: Router,
    private store: Store
  ) {}
}
