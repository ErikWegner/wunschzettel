import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, mergeMap, shareReplay } from 'rxjs';
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
    mergeMap((_) => this.itemsService.getCaptchaChallenge()),
    shareReplay(1)
  );

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
}
