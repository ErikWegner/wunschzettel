import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';
import { ItemsService } from 'src/app/services/items.service';
import { DialogData } from './dialog-data';

@Component({
  selector: 'app-update-reservation-dialog',
  templateUrl: './update-reservation-dialog.component.html',
  styleUrls: ['./update-reservation-dialog.component.scss'],
})
export class UpdateReservationDialogComponent implements OnInit {
  private challengeRequest$ = new Subject<void>();

  public title = '';
  public challenge$ = this.challengeRequest$.pipe(
    mergeMap((_) => this.itemsService.getCaptchaChallenge()),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.challengeRequest$.next();
    this.title =
      this.data.targetState === 'reserve'
        ? 'Reservieren'
        : 'Reservierung löschen';
  }
}
