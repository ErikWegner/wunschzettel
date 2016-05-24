import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable }          from 'rxjs/Observable';

import { WunschzettelService, IReserveResponse } from './ws.service';
import { Wunschzetteleintrag } from './wunschzetteleintrag';

interface IDialogInterface {
  showModal(): void
  close(): void
}
interface IDialogPolyfill {
  registerDialog(dialog: IDialogInterface): void
}
declare var dialogPolyfill: IDialogPolyfill

enum ReservierungsdialogStatus {
  Loading,
  Captcha,
  Submitting,
  Success,
  Fail,
  Error
}

@Component({
  selector: 'my-wunschreservierungsdialog',
  styleUrls: ['app/reservierungsdialog.component.css'],
  templateUrl: 'app/reservierungsdialog.component.html'
})
export class ReservierungsdialogComponent {
  public dialogStatusEnum = ReservierungsdialogStatus
  @ViewChild('dialog') dialogRef: ElementRef;
  dialog: IDialogInterface
  wunsch: Wunschzetteleintrag = new Wunschzetteleintrag()
  neuerWunschStatus = false; // actually: unknown
  captchaText = "..."
  captchaResult: string = "" // input from user
  dialogStatus: ReservierungsdialogStatus = ReservierungsdialogStatus.Captcha
  errorText = "" // if something goes wrong during service calls
  resultText = "" // response from service
  
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

  show(wunsch: Wunschzetteleintrag, neuerWunschStatus: boolean) {
    // Some data is required, set status
    this.dialogStatus = ReservierungsdialogStatus.Loading
    // Retrieve data
    this.service.getCaptcha().subscribe(
      // Data has arrived
      captchadata => {
        // Show captcha in dialog
        this.captchaText = captchadata.captchatext
        // Finally activate dialog
        this.dialogStatus = ReservierungsdialogStatus.Captcha
      },
      // An error has occured
      error => this.handleError(error)
    )
    
    this.captchaText = ""
    this.captchaResult = ""
    this.wunsch = wunsch
    this.neuerWunschStatus = neuerWunschStatus
    this.dialog.showModal()
  }

  onClose() {
    this.dialog.close();
  }

  onSubmit() {
    this.dialogStatus = ReservierungsdialogStatus.Submitting
    var o: Observable<IReserveResponse>;
    if (this.neuerWunschStatus === false) {
      o = this.service.clearReservation(this.wunsch.id, this.captchaResult);
    } else {
      o = this.service.reserveItem(this.wunsch.id, this.captchaResult);
    }

    o.subscribe(
      result => {
        this.dialogStatus = result.success ? ReservierungsdialogStatus.Success : ReservierungsdialogStatus.Fail;
        this.resultText = result.message;
      },
      error => this.handleError(error)
    )
  }

  private handleError(error: any) {
    this.dialogStatus = ReservierungsdialogStatus.Error;
    this.errorText = <any>error
  }
}