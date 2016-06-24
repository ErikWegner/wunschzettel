/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';

import { WunschlisteComponent } from './wunschliste';
import { WunschzettelService }  from './service';
import { WunschzetteleintragComponent } from './wunschzetteleintrag';
import { WunschzetteleintragFormComponent } from './wunschzetteleintragform';
import { ReservierungsdialogComponent } from './reservierungsdialog';
import { Category } from './common';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [WunschzettelService],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  templateUrl: './app.component.html',
})
export class App implements AfterViewInit {
  static isInitialized = false;
  categories: Category[] = [];
  selectedCategory: Category;
  title = "Wunschzettel";

  constructor(
    private el: ElementRef,
    private service: WunschzettelService
  ) {

  }

  ngOnInit() {
    this.selectedCategory = Category.allItemsCategory();
    this.service.categories$.subscribe(categories => {
      this.categories = categories;
    });
    this.service.getItems();
  }

  ngAfterViewInit() {
    if (!App.isInitialized) {
      App.isInitialized = true;
      componentHandler.upgradeElement(this.el.nativeElement.children[0]);
    }
  }
}
