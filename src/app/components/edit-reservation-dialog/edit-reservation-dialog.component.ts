import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/domain';
import { FormControl } from '@angular/forms';
import { DomainService } from 'src/app/domain.service';

export interface EditReservationDialogData {
  item: Item;
}

enum DlgState {
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

}
