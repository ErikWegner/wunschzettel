import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, CaptchaResponse } from 'src/app/domain';
import { FormControl } from '@angular/forms';
import { DomainService } from 'src/app/domain.service';

export interface EditReservationDialogData {
  item: Item;
}

export enum DlgState {
  /**
   * Loading the captcha challenge
   */
  Loading,

  /**
   * Waiting for user to input captcha response
   */
  Captcha,

  /**
   * Sending changes to the server
   */
  Submitting,

  /**
   * Data was successfully transmitted
   */
  Success,

  /**
   * An error occurred during transmission
   */
  Fail,

  /**
   * An error occurred while setting the state, e.g. captcha wrong or state mismatch
   */
  Error
}

@Component({
  selector: 'app-edit-reservation-dialog',
  templateUrl: './edit-reservation-dialog.component.html',
  styleUrls: ['./edit-reservation-dialog.component.css']
})
export class EditReservationDialogComponent implements OnInit {
  dlgStateEnum = DlgState;
  dlgState = DlgState.Loading;
  titleAndButtonText = '';
  captchaChallengeText = 'Sicherheitsfrage';
  captchaResponse = new FormControl('');
  resultText = '';

  constructor(
    public dialogRef: MatDialogRef<EditReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditReservationDialogData,
    public service: DomainService,
  ) {
    this.titleAndButtonText = data.item.isReserved ? 'Reservierung löschen' : 'Reservieren';
  }

  ngOnInit() {
    this.service.getCaptchaChallenge().subscribe({
      next: (result) => {
        this.captchaChallengeText = result.data.text;
      },
      error: (e) => {
        this.dlgState = DlgState.Fail;
      },
      complete: () => {
        this.dlgState = DlgState.Captcha;
      }
    });
  }

  submitClick() {
    this.dlgState = DlgState.Submitting;
    this.service.setReservationFlag(
      this.data.item.id,
      !this.data.item.isReserved,
      new CaptchaResponse(this.captchaResponse.value)).subscribe({
        next: (result) => {
          this.dlgState = result.success ? DlgState.Success : DlgState.Error;
          this.resultText = result.data;
        },
        error: (e) => {
          this.dlgState = DlgState.Fail;
          this.resultText = 'Übertragungsfehler';
        }
      });
  }

}
