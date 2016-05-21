import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WunschzettelService } from './ws.service';
import { Wunschzetteleintrag } from './wunschzetteleintrag';

@Component({
  selector: 'my-wunschzetteleintrag',
  styleUrls: ['app/wunschzetteleintrag.component.css'],
  templateUrl: 'app/wunschzetteleintrag.component.html'
})
export class WunschzetteleintragComponent {
  @Input() wunsch: Wunschzetteleintrag
  @Output() onReservierung = new EventEmitter<Wunschzetteleintrag>();
  @Output() onLoescheReservierung = new EventEmitter<Wunschzetteleintrag>();
  statusIsVisible = false
  statusButtonActive = true;
  wunschStatus = false; // actually: unknown
  errorText = "";

  constructor(
    private service: WunschzettelService) {
  }

  onShowStatus() {
    this.statusButtonActive = false;
    this.statusIsVisible = false;

    this.service.getItemStatus(this.wunsch.id).subscribe(
      result => {
        this.wunschStatus = result.status;
        this.statusButtonActive = true;
        this.statusIsVisible = true;
      },
      error => this.errorText = <any>error
    );
  }

  reservierung(newStatus: boolean) {
    this.statusButtonActive = true;
    this.statusIsVisible = false;
    if (newStatus === false) {
      this.onLoescheReservierung.emit(this.wunsch);
    } else {
      this.onReservierung.emit(this.wunsch);
    }
  }
}