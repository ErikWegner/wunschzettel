import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { WunschzettelService } from './ws.service';
import { MatchCategoryPipe }   from './category-filter.pipe';
import { WunschzetteleintragComponent } from './wunschzetteleintrag.component';
import { ReservierungsdialogComponent } from './reservierungsdialog.component';

@Component({
  selector: 'my-wunschliste',
  directives: [WunschzetteleintragComponent, ReservierungsdialogComponent],
  pipes: [MatchCategoryPipe],
  styleUrls: ['app/wunschliste.component.css'],
  templateUrl: 'app/wunschliste.component.html'
})
export class WunschlisteComponent implements OnInit {
  items: Wunschzetteleintrag[]
  @Input() category: Category
  hasDialog = false
  dialogWunsch: Wunschzetteleintrag = null
  @ViewChild(ReservierungsdialogComponent) reservierungsdialog: ReservierungsdialogComponent

  constructor(
    private router: Router,
    private service: WunschzettelService) {
    this.items = [];
    this.category = Category.allItemsCategory();
  }

  ngOnInit() {
    this.service.getItems()
      .subscribe(
      items => this.items = items
      );
  }

  onReservierung(wunsch: Wunschzetteleintrag) {
    this.reservierungsdialog.show(wunsch, true);
  }

  onLoescheReservierung(wunsch: Wunschzetteleintrag) {
    this.reservierungsdialog.show(wunsch, false);
  }
}