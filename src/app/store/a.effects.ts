import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { clearFailedRequestAndRetry } from './a.actions';

@Injectable()
export class AppGlobalStateEffects {
  retry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(clearFailedRequestAndRetry),
      map((i) => i.action)
    );
  });

  constructor(private actions$: Actions) {}
}
