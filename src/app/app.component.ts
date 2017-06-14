/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { AppState } from './app.service';

import { WunschlisteComponent } from './wunschliste';
import { WunschzettelService } from './service';
import { WunschzetteleintragComponent } from './wunschzetteleintrag';
import { WunschzetteleintragFormComponent } from './wunschzetteleintragform';
import { ReservierungsdialogComponent } from './reservierungsdialog';
import { Category } from './common';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [WunschzettelService],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  private static isInitialized = false;
  public categories: Category[] = [];
  public title = 'Wunschzettel';
  private selectedCategory: Category;

  constructor(
    private el: ElementRef,
    private service: WunschzettelService
  ) {

  }

  public ngOnInit() {
    this.selectedCategory = Category.allItemsCategory();
    this.service.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    this.service.getItems();
  }

  public ngAfterViewInit() {
    if (!AppComponent.isInitialized) {
      AppComponent.isInitialized = true;
      componentHandler.upgradeElement(this.el.nativeElement.children[0]);
    }
  }
}
