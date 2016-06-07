import { Component, OnInit, ViewChild } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { Wunschzetteleintrag }              from './wunschzetteleintrag';
import { Category }                         from './category';
import { WunschzettelService }              from './ws.service';
import { MatchCategoryPipe }                from './category-filter.pipe';
import { WunschzetteleintragComponent }     from './wunschzetteleintrag.component';
import { ReservierungsdialogComponent }     from './reservierungsdialog.component';

@Component({
  selector: 'my-wunschliste',
  directives: [
    WunschzetteleintragComponent,
    ReservierungsdialogComponent
  ],
  pipes: [MatchCategoryPipe],
  styleUrls: ['app/wunschliste.component.css'],
  templateUrl: 'app/wunschliste.component.html'
})
export class WunschlisteComponent implements OnInit {
  items: Wunschzetteleintrag[]
  category: Category
  hasDialog = false
  dialogWunsch: Wunschzetteleintrag = null
  @ViewChild(ReservierungsdialogComponent) reservierungsdialog: ReservierungsdialogComponent

  constructor(
    private routeParams: RouteParams,
    private service: WunschzettelService) {
    this.items = [];
    this.category = Category.allItemsCategory();
  }

  ngOnInit() {
    var routeparam = this.routeParams.get('category') || this.category.filter;
    this.service.items$
      .subscribe(
      items => {
        this.items = items;
        this.category = this.service.extractCategories(items).find(c => c.filter == routeparam)
      });
  }

  onReservierung(wunsch: Wunschzetteleintrag) {
    this.reservierungsdialog.show(wunsch, true);
  }

  onLoescheReservierung(wunsch: Wunschzetteleintrag) {
    this.reservierungsdialog.show(wunsch, false);
  }
}