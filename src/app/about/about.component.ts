import { Component, ElementRef, AfterViewInit } from '@angular/core';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

@Component({
  selector: 'about',
  styles: [`
  .formcard {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}
  `],
  template: `
<div class="mdl-card mdl-shadow--4dp formcard">
  <div class="mdl-card__title">
    <h2 class="mdl-card__title-text">Wunschzettel</h2>
  </div>
  <div class="mdl-card__supporting-text">
    <p>
      Version 23
    </p>
    <p>
      powered by<br>
      <img src="//ewus.de/img/logo2013.png" alt="EWUS" style="width:64px;height:64px;">
    </p>
  </div>
  <div class="mdl-card__actions">
    <a class="mdl-button close" [routerLink]="['/wunschliste']">Schließen</a>
  </div>
</div>
  `
})
export class About implements AfterViewInit {
  constructor(
    private el: ElementRef
  ) {

  }

  ngAfterViewInit() {
    // Material design
    componentHandler.upgradeElements(this.el.nativeElement);
  }
}
