import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { DialogData } from 'src/app/components/update-reservation-dialog/dialog-data';
import { UpdateReservationDialogComponent } from 'src/app/components/update-reservation-dialog/update-reservation-dialog.component';
import { confirmEditReservation } from '../r.actions';
import { selectActiveItem } from '../w.selectors';

@Injectable()
export class DialogEffects {
  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private store: Store
  ) {}

  // saveDataSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DataActions.SaveDataSuccess),
  //     map((response) => DialogActions.dialogClosed(response))
  //   )
  // );

  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(confirmEditReservation),
        concatLatestFrom((_action) => this.store.select(selectActiveItem)),
        tap(([_action, activeItem]) => {
          this.dialog.open(UpdateReservationDialogComponent, {
            data: <DialogData>{ itemId: activeItem?.id || 0 },
          });
        })
      );
    },
    { dispatch: false }
  );

  // dialogSaved$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DialogActions.dialogSaved),
  //     map((payload) => DataActions.SaveData(payload))
  //   )
  // );

  // dialogClosed$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DialogActions.dialogClosed),
  //     map((payload) => {
  //       this.dialogRef.closeAll();
  //       return snackBarActions.savedSuccessfully(payload);
  //     })
  //   )
  // );
}
