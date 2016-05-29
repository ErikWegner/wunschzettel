import { Component,ViewChild, ElementRef }  from '@angular/core';
import { NgForm }                           from '@angular/common';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router-deprecated';

import { Wunschzetteleintrag }              from './wunschzetteleintrag';

/// <reference path="custom-typings.d.ts" />

@Component({
  selector: 'wunschzetteleintrag-form',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['app/wunschzetteleintrag-form.component.css'],
  templateUrl: 'app/wunschzetteleintrag-form.component.html'
})
export class WunschzetteleintragFormComponent {
  @ViewChild('dialog') dialogRef: ElementRef;
  model = new Wunschzetteleintrag();
  submitted = false;
  constructor(
    private router: Router,
    private el:ElementRef) {
    }
  
  ngAfterViewInit() {
    componentHandler.upgradeElements(this.el.nativeElement);
  }
  onSubmit() { this.submitted = true; }  
}