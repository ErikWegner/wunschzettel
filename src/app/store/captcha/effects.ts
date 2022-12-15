import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ItemsService } from '../../services/items.service';
import {
  captchaChallengeError,
  captchaChallengeReceived,
  getCaptchaChallenge,
} from './actions';

const errorFactory = () =>
  captchaChallengeError({ errorText: 'Fehler beim Abruf' });

@Injectable()
export class CaptchaEffects {
  retrieveNewCaptcha$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCaptchaChallenge),
      exhaustMap((_) => this.service.getCaptchaChallenge()),
      map((r) =>
        r.success
          ? captchaChallengeReceived({ captchaTask: r.data })
          : errorFactory()
      ),
      catchError((e) => {
        console.error(e);
        return of(errorFactory());
      })
    );
  });

  constructor(private actions$: Actions, private service: ItemsService) {}
}
