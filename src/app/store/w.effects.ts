import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs';
import { ItemsService } from '../services/items.service';
import { getItems, goToCategory, itemsLoaded } from './w.actions';

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

  constructor(
    private actions$: Actions,
    private itemsService: ItemsService,
    private router: Router
  ) {}
}
