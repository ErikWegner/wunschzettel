import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { WunschzettelService } from '../service';
import { Wunschzetteleintrag } from '../common';

@Component({
  selector: 'my-wunschzetteleintrag',
  directives: [ROUTER_DIRECTIVES],
  styles: [require('./wunschzetteleintrag.component.css')],
  template: require('./wunschzetteleintrag.component.html')
})
export class WunschzetteleintragComponent implements AfterViewInit, OnInit, OnDestroy {
  private wunsch = new Wunschzetteleintrag();
  private statusIsVisible = false;
  private statusButtonActive = true;
  private wunschStatus = false; // actually: unknown
  private errorText = '';
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private service: WunschzettelService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.statusIsVisible = false;
      let id = +params['id'];
      if (id > 0) {
        this.service.items$.subscribe(
          items => {
            let item = items.find(i => i.id === id);
            if (!item) {
              this.router.navigate(['Wunschliste']);
              return;
            }

            this.wunsch = item;
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
    this.errorText = error;
  }
}
