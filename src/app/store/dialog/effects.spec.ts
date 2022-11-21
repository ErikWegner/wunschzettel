import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { DialogData } from 'src/app/components/update-reservation-dialog/dialog-data';
import { UpdateReservationDialogComponent } from 'src/app/components/update-reservation-dialog/update-reservation-dialog.component';
import { appStateStub } from 'testing/app.state.builder';
import { confirmEditReservation } from '../r.actions';

import { DialogEffects } from './effects';

describe('DialogEffects', () => {
  let actions$: Observable<Action>;
  let effects: DialogEffects;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    let matDialog = jasmine.createSpyObj('MatDialog', ['open']);
    let actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([DialogEffects])],
      providers: [
        provideMockStore({ initialState: appStateStub().withActiveItem() }),
        provideMockActions(() => actions$),
        {
          provide: MatDialog,
          useValue: matDialog,
        },
      ],
    });

    effects = TestBed.inject(DialogEffects);
    matDialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  [{ targetState: 'reserve' }, { targetState: 'clean' }].forEach((testsetup) =>
    it('should open dialog for confirmEditReservation', () => {
      // Arrange
      actions$ = of(
        confirmEditReservation({ targetState: testsetup.targetState as any })
      );

      // Act
      effects.openDialog$.subscribe();

      // Assert
      expect(matDialogMock.open).toHaveBeenCalledOnceWith(
        UpdateReservationDialogComponent,
        {
          data: <DialogData>{
            itemId: 0,
            targetState: testsetup.targetState as any,
          },
        }
      );
    })
  );
});
