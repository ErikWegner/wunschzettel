import { Component, OnInit, ViewChild } from '@angular/core';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Wunschzetteleintrag, Category } from '../common';
import { WunschzettelService } from '../service';
import { MatchCategoryPipe } from './category-filter.pipe';

@Component({
  selector: 'my-wunschliste',
  directives: [ROUTER_DIRECTIVES],
  pipes: [MatchCategoryPipe],
  styles: [require('./wunschliste.component.css')],
  template: require('./wunschliste.component.html')
})
export class WunschlisteComponent implements OnInit {
  items: Wunschzetteleintrag[]
  category: Category
  hasDialog = false
  dialogWunsch: Wunschzetteleintrag = null

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
}