import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { WunschzettelService } from './ws.service';
import { Wunschzetteleintrag } from './wunschzetteleintrag';

interface IDialogInterface {
  showModal()
}
interface IDialogPolyfill {
  registerDialog(dialog: IDialogInterface)
}
declare var dialogPolyfill: IDialogPolyfill

@Component({
  selector: 'my-wunschreservierungsdialog',
//  styleUrls: ['app/reservierungsdialog.component.css'],
  templateUrl: 'app/reservierungsdialog.component.html'
})
export class ReservierungsdialogComponent {
  @ViewChild('dialog') dialogRef: ElementRef;
  dialog: IDialogInterface
  wunsch: Wunschzetteleintrag
  wunschStatus = false; // actually: unknown
  
  constructor(
    private service: WunschzettelService
    ) {
  }
  
  ngAfterViewInit() {
    // child is set, prepare polyfill
    this.dialog = this.dialogRef.nativeElement;
    if (!this.dialog.showModal) {
      dialogPolyfill.registerDialog(this.dialog);
    }
  }
  
  show(wunsch: Wunschzetteleintrag, wunschStatus: boolean) {
    this.dialog.showModal();
  }
}