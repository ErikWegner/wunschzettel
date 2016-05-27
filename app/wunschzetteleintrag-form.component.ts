import { Component,ViewChild, ElementRef }  from '@angular/core';
import { NgForm }                           from '@angular/common';

import { Wunschzetteleintrag }              from './wunschzetteleintrag';

/// <reference path="custom-typings.d.ts" />

@Component({
  selector: 'wunschzetteleintrag-form',
  templateUrl: 'app/wunschzetteleintrag-form.component.html'
})
export class WunschzetteleintragFormComponent {
  @ViewChild('dialog') dialogRef: ElementRef;
  dialog: IDialogInterface
  model = new Wunschzetteleintrag();
  submitted = false;
  
  constructor(private el:ElementRef) {
    }
  
  ngAfterViewInit() {
    // child is set, prepare polyfill
    componentHandler.upgradeElements(this.el.nativeElement);
    this.dialog = this.dialogRef.nativeElement;
    
    if (!this.dialog.showModal) {
      dialogPolyfill.registerDialog(this.dialog);
    }
    
    this.dialog.showModal();
  }
  
  onSubmit() { this.submitted = true; }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}