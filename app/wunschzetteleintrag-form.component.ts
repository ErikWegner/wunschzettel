import { Component, ViewChild, ElementRef }  from '@angular/core';
import { NgForm }                           from '@angular/common';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router-deprecated';

import { WunschzettelService, IReserveResponse } from './ws.service';
import { Wunschzetteleintrag }              from './wunschzetteleintrag';

enum Formularstatus {
  // Initiales Laden, warten auf Captcha-Antwort
  InitLoading,
  // Benutzer kann Formular bearbeiten
  Edit,
  // Formular abgesendet, warten
  Submitting,
  // Ein Fehler ist aufgetreten
  Error
}

@Component({
  selector: 'wunschzetteleintrag-form',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['app/wunschzetteleintrag-form.component.css'],
  templateUrl: 'app/wunschzetteleintrag-form.component.html'
})
export class WunschzetteleintragFormComponent {
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
    private el: ElementRef) {
      this.errorText = "bl";
  }

  ngAfterViewInit() {
     
    // Material design
    componentHandler.upgradeElements(this.el.nativeElement);

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
    this.service
      .addItem(this.model, this.captchaResult)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          this.handleError(error)
          this.formularStatus = Formularstatus.Edit;
        }
      );
  }

  private handleError(error: any) {
    this.errorText = <any>error
  }

}