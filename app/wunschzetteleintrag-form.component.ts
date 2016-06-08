import { Component, ViewChild, ElementRef, AfterViewInit, OnInit }  from '@angular/core';
import { NgForm } from '@angular/common';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';

import { WunschzettelService, IReserveResponse, ICRUDResponse } from './ws.service';
import { Wunschzetteleintrag }              from './wunschzetteleintrag';

enum Formularstatus {
  // Initiales Laden, warten auf Captcha-Antwort
  InitLoading,
  // Benutzer kann Formular bearbeiten
  Edit,
  // Formular abgesendet, warten
  Submitting,
  // Ein Fehler ist aufgetreten
  Error,
  // Der Eintrag soll gelöscht werden
  PrepareErase
}

@Component({
  selector: 'wunschzetteleintrag-form',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['app/wunschzetteleintrag-form.component.css'],
  templateUrl: 'app/wunschzetteleintrag-form.component.html'
})
export class WunschzetteleintragFormComponent implements AfterViewInit, OnInit {
  public formularStatusEnum = Formularstatus
  @ViewChild('dialog') dialogRef: ElementRef;
  model = new Wunschzetteleintrag();
  submitted = false;
  captchaText: string
  captchaResult: string = "" // input from user
  formularStatus: Formularstatus = Formularstatus.InitLoading
  errorText = "" // if something goes wrong during service calls
  resultText = "" // response from service

  constructor(
    private service: WunschzettelService,
    private router: Router,
    private routeParams: RouteParams,
    private el: ElementRef) {

  }

  ngOnInit() {
    let id = +this.routeParams.get('id');
    if (id > 0) {
      this.service.items$.subscribe(
        items => {
          var item = items.find(i => i.id == id);
          if (!item) {
            this.router.navigate(['Wunschliste']);
            return;
          }

          this.model = JSON.parse(JSON.stringify(item));
        }, error => this.handleError(error)
      );

      this.service.getItems()
    }
  }

  ngAfterViewInit() {
    // Material design
    componentHandler.upgradeElements(this.el.nativeElement);
    this.initCaptcha();
  }

  initCaptcha() {
    // Retrieve data
    this.service.getCaptcha().subscribe(
      // Data has arrived
      captchadata => {
        // Show captcha in form
        this.captchaText = "Bitte als Ziffer eingeben: " + captchadata.captchatext
        // Finally activate form elements
        this.formularStatus = Formularstatus.Edit
      },
      // An error has occured
      error => this.handleError(error)
    )

    this.captchaText = ""
    this.captchaResult = ""
  }

  onSubmit() {
    this.formularStatus = Formularstatus.Submitting;
    var toastText: string;
    var o: Observable<ICRUDResponse>;
    if (this.model.id > 0) {
      o = this.service.updateItem(this.model, this.captchaResult);
      toastText = "Eintrag aktualisiert";
    } else {
      o = this.service.addItem(this.model, this.captchaResult);
      toastText = "Eintrag angelegt";
    }

    o.subscribe(
      response => {
        if (response.success) {
          this.toastMessage(toastText);
          this.router.navigate(['Wunschliste', { category: this.model.Category }]);
          return;
        }

        this.errorText = response.message;
        this.formularStatus = Formularstatus.InitLoading;
        this.initCaptcha();
      }
    )
  }

  private handleError(error: any) {
    debugger;
    this.errorText = error
    this.formularStatus = Formularstatus.InitLoading;
    this.initCaptcha();
  }

  onPrepareErase() {
    this.formularStatus = Formularstatus.PrepareErase;
    var eraseCaptchaText = prompt("Zum Bestätigen des Löschens: " + this.captchaText);
    if (eraseCaptchaText) {
      this.service.removeItem(this.model.id, eraseCaptchaText).subscribe(
        response => {
          if (response.success) {
            this.toastMessage('Eintrag gelöscht');
            this.router.navigate(['Wunschliste']);
            return;
          }

          this.errorText = response.message;
          this.formularStatus = Formularstatus.InitLoading;
          this.initCaptcha();
        }
      );
    }
  }

  private toastMessage(message: string) {
    var notification = document.querySelector('.mdl-js-snackbar');
    (<any>notification).MaterialSnackbar.showSnackbar(
      {
        message: message
      }
    );
  }
}