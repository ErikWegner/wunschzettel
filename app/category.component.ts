import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { WunschzettelService } from './ws.service';

@Component({
  selector: 'my-categories',
  templateUrl: 'app/category.component.html',
  styleUrls: ['app/category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  errorMessage: string;

  constructor(
    private router: Router,
    private service: WunschzettelService) {
  }
  
  ngOnInit() {
    this.service.getItems()
    .subscribe(
      items => this.categories = this.extractCategories(items),
      error =>  this.errorMessage = <any>error
    );
  }
  
  extractCategories(items: Wunschzetteleintrag[]): Category[] {
    var r: Category[] = [];
    r.push(Category.allItemsCategory());
    items.forEach(item => {
      var itemCategory = new Category(item.Category);
      var isNewCategory = true;
      r.forEach(category => {
        isNewCategory = isNewCategory && category.equals(itemCategory) == false;
      });
      if (isNewCategory) {
        r.push(itemCategory);
      }
    });
    return r;
  }
}