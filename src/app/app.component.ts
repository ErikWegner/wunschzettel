/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { RouteConfig, Router } from '@angular/router-deprecated';

import { RouterActive } from './router-active';
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
  pipes: [],
  providers: [WunschzettelService],
  directives: [RouterActive],
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('./app.css'),
    require('../../bower_components/dialog-polyfill/dialog-polyfill.css'),
    require('../../bower_components/material-design-lite/material.min.css'),
  ],
  template: require('./app.component.html'),
})
@RouteConfig([
  {
    path: '/wunschliste',
    name: 'Wunschliste',
    component: WunschlisteComponent,
    useAsDefault: true,
    data: { category: Category.allItemsCategory().filter }
  }, {
    path: '/wunschliste/details/:id',
    name: 'WunschDetail',
    component: WunschzetteleintragComponent,
  }, {
    path: '/wunschliste/bearbeiten/:id',
    name: 'WunschBearbeiten',
    component: WunschzetteleintragFormComponent,
  }, {
    path: '/wunschliste/reservierung/:id/:zielzustand',
    name: 'WunschReservieren',
    component: ReservierungsdialogComponent,
  }, {
    path: '/neu',
    name: 'NeuerEintrag',
    component: WunschzetteleintragFormComponent
  },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  { path: '/about', name: 'About', loader: () => require('es6-promise!./about')('About') }
])
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
