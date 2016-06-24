import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Wunschzetteleintrag, Category } from '../common';
import { WunschzettelService } from '../service';
import { MatchCategoryPipe } from './category-filter.pipe';
import { SummaryPipe } from './summary.pipe';

@Component({
  selector: 'my-wunschliste',
  directives: [ROUTER_DIRECTIVES],
  pipes: [
    MatchCategoryPipe,
    SummaryPipe
  ],
  styles: [require('./wunschliste.component.css')],
  template: require('./wunschliste.component.html')
})
export class WunschlisteComponent implements OnInit, OnDestroy {
  items: Wunschzetteleintrag[]
  category: Category
  hasDialog = false
  dialogWunsch: Wunschzetteleintrag = null
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: WunschzettelService) {
    this.items = [];
    this.category = Category.allItemsCategory();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
        var routeparam = params['category'] || this.category.filter;
        this.service.items$
          .subscribe(
          items => {
            this.items = items;
            this.category = this.service.extractCategories(items).find(c => c.filter == routeparam)
          });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}