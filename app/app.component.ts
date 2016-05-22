import { Component, ElementRef, AfterViewInit }       from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { HeroService }         from './hero.service';
import { WunschzettelService }         from './ws.service';
import { HeroesComponent }     from './heroes.component';
import { CategoryComponent }  from './category.component';
import { HeroDetailComponent } from './hero-detail.component';

/* Material Design component handler interface */
interface IComponentHandler {
  /** For dynamic elements, call this function */
  upgradeElement(el: HTMLElement)
}
declare var componentHandler : IComponentHandler;

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    WunschzettelService,
    HeroService
  ]
})
@RouteConfig([
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryComponent,
    useAsDefault: true
  },
  {
  path: '/detail/:id',
  name: 'HeroDetail',
  component: HeroDetailComponent
  },
  {
    path: '/heroes',
    name: 'Heroes',
    component: HeroesComponent
  }
])
export class AppComponent implements AfterViewInit{
  title = 'Wunschzettel';
  static isInitialized = false;
  
  constructor(private el:ElementRef) {
    }

  ngAfterViewInit() {
    if (!AppComponent.isInitialized) {
      AppComponent.isInitialized = true;
      componentHandler.upgradeElement(this.el.nativeElement.children[0]);
    }
  }
}