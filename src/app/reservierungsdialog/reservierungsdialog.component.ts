import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { WunschzettelService, IReserveResponse } from '../service';
import { Wunschzetteleintrag } from '../common';

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
  directives: [ROUTER_DIRECTIVES],
  styles: [require('./reservierungsdialog.component.css')],
  template: require('./reservierungsdialog.component.html')
})
export class ReservierungsdialogComponent implements AfterViewInit, OnInit {
  public dialogStatusEnum = ReservierungsdialogStatus
  wunsch: Wunschzetteleintrag = new Wunschzetteleintrag()
  neuerWunschStatus = false; // actually: unknown
  captchaText = "..."
  captchaResult: string = "" // input from user
  dialogStatus: ReservierungsdialogStatus = ReservierungsdialogStatus.Captcha
  errorText = "" // if something goes wrong during service calls
  resultText = "" // response from service

  constructor(
    private routeParams: RouteParams,
    private router: Router,
    private el: ElementRef,
    private service: WunschzettelService
  ) {
  }

  ngOnInit() {
    // Some data is required, set status
    this.dialogStatus = ReservierungsdialogStatus.Loading

    // Defaults
    this.captchaText = ""
    this.captchaResult = ""
    this.neuerWunschStatus = this.routeParams.get('zielzustand') == 'setzen';

    let id = +this.routeParams.get('id');
    if (id > 0) {
      this.service.items$.subscribe(
        items => {
          var item = items.find(i => i.id == id);
          if (!item) {
            this.router.navigate(['Wunschliste']);
            return;
          }

          this.wunsch = item;

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

        }, error => this.handleError(error)
      );

      this.service.getItems()
    }
  }

  ngAfterViewInit() {
    componentHandler.upgradeElements(this.el.nativeElement.children[0]);
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