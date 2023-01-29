import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { DialogData } from 'src/app/components/update-reservation-dialog/dialog-data';
import { UpdateReservationDialogComponent } from 'src/app/components/update-reservation-dialog/update-reservation-dialog.component';
import { appStateStub } from 'testing/app.state.builder';
import { modifyReservation } from '../r.actions';

import { DialogEffects } from './effects';

describe('DialogEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: DialogEffects;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let activeItemId: number;

  beforeEach(() => {
    let matDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const initialState = appStateStub().withActiveItem();
    activeItemId = initialState.wishlist.activeItem?.id || 0;
    TestBed.configureTestingModule({
      providers: [
        DialogEffects,
        {
          provide: MatDialog,
          useValue: matDialog,
        },
        provideMockStore({
          initialState,
        }),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(DialogEffects);
    matDialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  [
    { targetState: 'reserve', name: 'confirmEditReservation' },
    { targetState: 'clean', name: 'confirmClearReservation' },
  ].forEach((testsetup) => {
    it('should open dialog for ' + testsetup.name, () => {
      // Arrange
      actions$ = of(
        modifyReservation({ targetState: testsetup.targetState as any })
      );

      // Act
      effects.openDialog$.subscribe();

      // Assert
      expect(matDialogMock.open).toHaveBeenCalledOnceWith(
        UpdateReservationDialogComponent,
        {
          data: <DialogData>{
            itemId: activeItemId,
            targetState: testsetup.targetState as any,
          },
        }
      );
    });
  });

  it('should provide dialog reference ', () => {
    // Arrange
    actions$ = of(
      modifyReservation({ targetState: 'clear' })
    );
    const next = jasmine.createSpy('next');
    const r = Symbol('MatDialogRef');
    matDialogMock.open.and.returnValue(r as any)

    // Act
    effects.openDialog$.subscribe(next);

    // Assert
    expect(next).toHaveBeenCalledOnceWith({ dialog: r, type: '[R] Modify reservation status dialog opened' });
  });
});
