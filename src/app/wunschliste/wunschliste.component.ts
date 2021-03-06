import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Wunschzetteleintrag, Category } from '../common';
import { WunschzettelService } from '../service';
import { MatchCategoryPipe } from './category-filter.pipe';
import { SummaryPipe } from './summary.pipe';

type uiStatus = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'my-wunschliste',
  styleUrls: ['./wunschliste.component.css'],
  templateUrl: './wunschliste.component.html'
})
export class WunschlisteComponent implements OnInit, OnDestroy {
  public items: Wunschzetteleintrag[];
  public category: Category;
  public uiStatus: uiStatus = 'loading';
  public errorText = "";
  private hasDialog = false;
  private dialogWunsch: Wunschzetteleintrag = null;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: WunschzettelService) {
    this.items = [];
    this.category = Category.allItemsCategory();
  }

  public ngOnInit() {
    this.uiStatus = 'loading';
    this.sub = this.route.params.subscribe((params) => {
      let routeparam = params['category'] || this.category.filter;
      this.service.items$
        .subscribe(
        (items) => {
          this.uiStatus = 'loaded';
          this.items = items;
          this.category = this.service.extractCategories(items)
            .find((c) => c.filter === routeparam);
        },
        (error) => {
          this.uiStatus = "error";
          this.errorText = error;
        });
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
