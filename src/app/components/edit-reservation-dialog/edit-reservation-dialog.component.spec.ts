import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReservationDialogComponent } from './edit-reservation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('EditReservationDialogComponent', () => {
  let component: EditReservationDialogComponent;
  let fixture: ComponentFixture<EditReservationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditReservationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: null },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
