import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, CaptchaResponse } from 'src/app/domain';
import { Validators, FormBuilder } from '@angular/forms';
import { DomainService } from 'src/app/domain.service';
import { CaptchaState } from '../captcha-state';

export interface EditReservationDialogData {
  item: Item;
  isReserved: boolean;
}

@Component({
  selector: 'app-edit-reservation-dialog',
  templateUrl: './edit-reservation-dialog.component.html',
  styleUrls: ['./edit-reservation-dialog.component.css']
})
export class EditReservationDialogComponent implements OnInit {
  dlgStateEnum = CaptchaState;
  dlgState = CaptchaState.Loading;
  titleAndButtonText = '';
  captchaChallengeText = 'Sicherheitsfrage';
  captchaChallengeHint = 'Hinweis';
  resultText = '';

  reservationForm = this.fb.group({
    captchaResponse: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditReservationDialogData,
    public service: DomainService,
  ) {
    this.titleAndButtonText = data.isReserved ? 'Reservierung löschen' : 'Reservieren';
  }

  ngOnInit() {
    this.service.getCaptchaChallenge().subscribe({
      next: (result) => {
        this.captchaChallengeText = result.data.text;
        this.captchaChallengeHint = result.data.hint;
      },
      error: (e) => {
        this.dlgState = CaptchaState.Fail;
      },
      complete: () => {
        this.dlgState = CaptchaState.WaitingForUserInput;
      }
    });
  }

  retryCaptcha() {
    this.dlgState = CaptchaState.Loading;
    this.ngOnInit();
  }

  submitClick() {
    this.dlgState = CaptchaState.Submitting;
    this.service.setReservationFlag(
      this.data.item.id,
      !this.data.isReserved,
      new CaptchaResponse(this.reservationForm.get('captchaResponse').value)).subscribe({
        next: (result) => {
          this.dlgState = result.success ? CaptchaState.Success : CaptchaState.Error;
          this.resultText = result.data;
        },
        error: (e) => {
          this.dlgState = CaptchaState.Fail;
          this.resultText = 'Übertragungsfehler';
          this.dialogRef.updateSize();
        }
      });
  }

}
