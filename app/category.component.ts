import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { WunschzettelService } from './ws.service';
import { WunschlisteComponent }  from './wunschliste.component';

@Component({
  selector: 'my-categories',
  directives: [WunschlisteComponent],
  templateUrl: 'app/category.component.html',
  styleUrls: ['app/category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category;
  errorMessage: string;

  constructor(
    private router: Router,
    private service: WunschzettelService) {
  }
  
  ngOnInit() {
    this.selectedCategory = Category.allItemsCategory();
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
  
    onSelect(category: Category) { this.selectedCategory = category; }
}