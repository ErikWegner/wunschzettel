import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { map } from "rxjs";
import { getItems } from "./w.actions";

@Injectable()
export class WishlistEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(_ => getItems())
    )
  );

  constructor(private actions$: Actions,) { }
}
