import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { WunschzettelService } from './ws.service';
import { MatchCategoryPipe }   from './category-filter.pipe';
import { WunschzetteleintragComponent } from './wunschzetteleintrag.component';

@Component({
  selector: 'my-wunschliste',
  directives: [WunschzetteleintragComponent],
  pipes: [MatchCategoryPipe],
  styleUrls: ['app/wunschliste.component.css'],
  templateUrl: 'app/wunschliste.component.html'
})
export class WunschlisteComponent implements OnInit {
  items: Wunschzetteleintrag[]
  @Input() category: Category
  
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
}