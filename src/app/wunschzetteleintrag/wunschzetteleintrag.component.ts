import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WunschzettelService } from '../service';
import { Wunschzetteleintrag } from '../common';

@Component({
  selector: 'my-wunschzetteleintrag',
  styleUrls: ['./wunschzetteleintrag.component.css'],
  templateUrl: './wunschzetteleintrag.component.html'
})
export class WunschzetteleintragComponent implements AfterViewInit, OnInit, OnDestroy {
  public wunsch = new Wunschzetteleintrag();
  public statusIsVisible = false;
  public statusButtonActive = true;
  public wunschStatus = false; // actually: unknown
  public errorText = '';
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private service: WunschzettelService) {
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.statusIsVisible = false;
      let id = +params['id'];
      if (id > 0) {
        this.service.items$.subscribe(
          (items) => {
            let item = items.find((i) => i.id === id);
            if (!item) {
              this.router.navigate(['/wunschliste']);
              return;
            }

            this.wunsch = item;
          }, (error) => this.handleError(error)
        );

        this.service.getItems();
      }
    });
  }

  public ngAfterViewInit() {
    componentHandler.upgradeElements(this.el.nativeElement.children[0]);
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onShowStatus() {
    this.statusButtonActive = false;
    this.statusIsVisible = false;

    this.service.getItemStatus(this.wunsch.id).subscribe(
      (result) => {
        this.wunschStatus = result.status;
        this.statusButtonActive = true;
        this.statusIsVisible = true;
      },
      (error) => this.errorText = <any>error
    );
  }

  private handleError(error: any) {
    this.errorText = error;
  }
}
