import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy }  from '@angular/core';
import { NgForm } from '@angular/common';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { WunschzettelService, IReserveResponse, ICRUDResponse } from '../service';
import { Wunschzetteleintrag } from '../common';

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
  styleUrls: ['./wunschzetteleintrag-form.component.css'],
  templateUrl: './wunschzetteleintrag-form.component.html'
})
export class WunschzetteleintragFormComponent implements AfterViewInit, OnInit, OnDestroy {
  public formularStatusEnum = Formularstatus;
  private model = new Wunschzetteleintrag();
  private submitted = false;
  private captchaText: string;
  private captchaResult: string = ''; // input from user
  private formularStatus: Formularstatus = Formularstatus.InitLoading;
  private errorText = ''; // if something goes wrong during service calls
  private resultText = ''; // response from service
  private sub: any;

  constructor(
    private service: WunschzettelService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id'];
      if (id > 0) {
        this.service.items$.subscribe(
          items => {
            let item = items.find(i => i.id === id);
            if (!item) {
              this.router.navigate(['/wunschliste']);
              return;
            }

            this.model = JSON.parse(JSON.stringify(item));
            this.model.Description = this.model.Description.replace(/<br>/g, '\n');
          }, error => this.handleError(error)
        );

        this.service.getItems();
      }
    });
    this.initCaptcha();
  }

  ngAfterViewInit() {
    // Material design
    componentHandler.upgradeElements(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initCaptcha() {
    this.captchaText = '';
    this.captchaResult = '';

    // Retrieve data
    this.service.getCaptcha().subscribe(
      // Data has arrived
      captchadata => {
        // Show captcha in form
        this.captchaText = 'Bitte als Ziffer eingeben: ' + captchadata.captchatext;
        // Finally activate form elements
        this.formularStatus = Formularstatus.Edit;
      },
      // An error has occured
      error => this.handleError(error)
    );
  }

  onSubmit() {
    this.formularStatus = Formularstatus.Submitting;
    let toastText: string;
    let o: Observable<ICRUDResponse>;
    if (this.model.id > 0) {
      o = this.service.updateItem(this.model, this.captchaResult);
      toastText = 'Eintrag aktualisiert';
    } else {
      o = this.service.addItem(this.model, this.captchaResult);
      toastText = 'Eintrag angelegt';
    }

    o.subscribe(
      response => {
        if (response.success) {
          this.toastMessage(toastText);
          this.router.navigate(
            ['/wunschliste'],
            { queryParams: { category: this.model.Category } }
          );
          return;
        }

        this.errorText = response.message;
        this.formularStatus = Formularstatus.InitLoading;
        this.initCaptcha();
      }
    );
  }

  onPrepareErase() {
    this.formularStatus = Formularstatus.PrepareErase;
    let eraseCaptchaText = prompt('Zum Bestätigen des Löschens: ' + this.captchaText);
    if (eraseCaptchaText) {
      this.service.removeItem(this.model.id, eraseCaptchaText).subscribe(
        response => {
          if (response.success) {
            this.toastMessage('Eintrag gelöscht');
            this.router.navigate(['/wunschliste']);
            return;
          }

          this.errorText = response.message;
          this.formularStatus = Formularstatus.InitLoading;
          this.initCaptcha();
        }
      );
    }
  }

  private handleError(error: any) {
    this.errorText = error;
    this.formularStatus = Formularstatus.InitLoading;
    this.initCaptcha();
  }

  private toastMessage(message: string) {
    let notification = document.querySelector('.mdl-js-snackbar');
    (<any>notification).MaterialSnackbar.showSnackbar(
      {
        message: message
      }
    );
  }
}
