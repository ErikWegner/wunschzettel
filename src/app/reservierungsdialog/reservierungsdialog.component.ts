import { Component, Input, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

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
export class ReservierungsdialogComponent implements AfterViewInit, OnInit, OnDestroy {
  public dialogStatusEnum = ReservierungsdialogStatus;
  wunsch: Wunschzetteleintrag = new Wunschzetteleintrag();
  neuerWunschStatus = false; // actually: unknown
  captchaText = '...';
  captchaResult: string = ''; // input from user
  dialogStatus: ReservierungsdialogStatus = ReservierungsdialogStatus.Captcha;
  errorText = ''; // if something goes wrong during service calls
  resultText = ''; // response from service
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private service: WunschzettelService
  ) {
  }

  ngOnInit() {
    // Some data is required, set status
    this.dialogStatus = ReservierungsdialogStatus.Loading;

    // Defaults
    this.captchaText = '';
    this.captchaResult = '';

    this.sub = this.route.params.subscribe(params => {
      this.neuerWunschStatus = params['zielzustand'] === 'setzen';

      let id = +params['id'];
      if (id > 0) {
        this.service.items$.subscribe(
          items => {
            let item = items.find(i => i.id === id);
            if (!item) {
              this.router.navigate(['/wunschliste']);
              return;
            }

            this.wunsch = item;

            // Retrieve data
            this.service.getCaptcha().subscribe(
              // Data has arrived
              captchadata => {
                // Show captcha in dialog
                this.captchaText = captchadata.captchatext;
                // Finally activate dialog
                this.dialogStatus = ReservierungsdialogStatus.Captcha;
              },
              // An error has occured
              error => this.handleError(error)
            );

          }, error => this.handleError(error)
        );

        this.service.getItems();
      }
    });
  }

  ngAfterViewInit() {
    componentHandler.upgradeElements(this.el.nativeElement.children[0]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.dialogStatus = ReservierungsdialogStatus.Submitting;
    let o: Observable<IReserveResponse>;
    if (this.neuerWunschStatus === false) {
      o = this.service.clearReservation(this.wunsch.id, this.captchaResult);
    } else {
      o = this.service.reserveItem(this.wunsch.id, this.captchaResult);
    }

    o.subscribe(
      result => {
        this.dialogStatus = result.success
          ? ReservierungsdialogStatus.Success
          : ReservierungsdialogStatus.Fail;
        this.resultText = result.message;
      },
      error => this.handleError(error)
    );
  }

  private handleError(error: any) {
    this.dialogStatus = ReservierungsdialogStatus.Error;
    this.errorText = <any>error;
  }
}
