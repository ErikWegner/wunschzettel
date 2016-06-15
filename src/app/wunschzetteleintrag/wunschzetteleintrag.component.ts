import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { WunschzettelService } from '../service';
import { Wunschzetteleintrag } from '../common';

@Component({
  selector: 'my-wunschzetteleintrag',
  directives: [ROUTER_DIRECTIVES],
  styles: [require('./wunschzetteleintrag.component.css')],
  template: require('./wunschzetteleintrag.component.html')
})
export class WunschzetteleintragComponent implements AfterViewInit, OnInit {
  private wunsch = new Wunschzetteleintrag()
  statusIsVisible = false
  statusButtonActive = true;
  wunschStatus = false; // actually: unknown
  errorText = "";

  constructor(
    private routeParams: RouteParams,
    private router: Router,
    private el: ElementRef,
    private service: WunschzettelService) {
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

          this.wunsch = item;
        }, error => this.handleError(error)
      );

      this.service.getItems()
    }
  }

  ngAfterViewInit() {
    componentHandler.upgradeElements(this.el.nativeElement.children[0]);
  }

  onShowStatus() {
    this.statusButtonActive = false;
    this.statusIsVisible = false;

    this.service.getItemStatus(this.wunsch.id).subscribe(
      result => {
        this.wunschStatus = result.status;
        this.statusButtonActive = true;
        this.statusIsVisible = true;
      },
      error => this.errorText = <any>error
    );
  }

  private handleError(error: any) {
    debugger;
    this.errorText = error
  }
}