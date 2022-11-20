import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { UpdateReservationDialogComponent } from 'src/app/components/update-reservation-dialog/update-reservation-dialog.component';
import { setActiveItemAndShowReservationDialog } from '../w.actions';
import { showReservationDialog } from './actions';

@Injectable()
export class DialogEffects {
  constructor(private actions$: Actions, private dialog: MatDialog) {}

  // saveDataSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DataActions.SaveDataSuccess),
  //     map((response) => DialogActions.dialogClosed(response))
  //   )
  // );

  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(setActiveItemAndShowReservationDialog),
        tap((payload) => {
          this.dialog.open(UpdateReservationDialogComponent, {
            data: { itemId: payload.item?.id },
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
