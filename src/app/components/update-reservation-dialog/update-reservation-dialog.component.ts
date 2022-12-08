import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, mergeMap, shareReplay, tap } from 'rxjs';
import { ItemsService } from 'src/app/services/items.service';
import { DialogData } from './dialog-data';

@Component({
  selector: 'app-update-reservation-dialog',
  templateUrl: './update-reservation-dialog.component.html',
  styleUrls: ['./update-reservation-dialog.component.scss'],
})
export class UpdateReservationDialogComponent implements OnInit {
  private challengeRequest$ = new BehaviorSubject(null);

  public title = '';
  public challenge$ = this.challengeRequest$.pipe(
    tap((_) => {
      this.requestPending = true;
    }),
    mergeMap((_) => this.itemsService.getCaptchaChallenge()),
    tap((_) => {
      this.requestPending = false;
    }),
    shareReplay(1)
  );
  public requestPending = false;
  public captchaInputValue = new FormControl('');
  public updateResultMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.title =
      this.data.targetState === 'reserve'
        ? 'Reservieren'
        : 'Reservierung löschen';
  }

  challengeRequest(): void {
    this.challengeRequest$.next(null);
  }

  updateRequest(): void {
    const captcha = this.captchaInputValue.value;
    if (captcha && captcha.length > 0) {
      this.itemsService
        .setReservationFlag(
          this.data.itemId,
          this.data.targetState === 'reserve',
          captcha
        )
        .subscribe((result) => {
          if (!result.success) {
            this.updateResultMessage = result.data;
          }
        });
    }
  }
}
