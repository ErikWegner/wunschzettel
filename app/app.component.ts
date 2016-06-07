import { Component, ElementRef, AfterViewInit }       from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { Wunschzetteleintrag }  from './wunschzetteleintrag';
import { Category }             from './category';
import { WunschzettelService }  from './ws.service';
import { WunschlisteComponent } from './wunschliste.component';
import { WunschzetteleintragFormComponent } from './wunschzetteleintrag-form.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    WunschzettelService
  ]
})
@RouteConfig([
  {
    path: '/wunschliste',
    name: 'Wunschliste',
    component: WunschlisteComponent,
    useAsDefault: true,
    data: { category: Category.allItemsCategory().filter }
  }
  ,{
    path: '/neu',
    name: 'NeuerEintrag',
    component: WunschzetteleintragFormComponent
  }
])
export class AppComponent implements AfterViewInit {
  title = 'Wunschzettel';
  static isInitialized = false;
  categories: Category[] = [];
  selectedCategory: Category;
  errorMessage: string;

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
    if (!AppComponent.isInitialized) {
      AppComponent.isInitialized = true;
      componentHandler.upgradeElement(this.el.nativeElement.children[0]);
    }
  }
  
  private onItemAdded(item: Wunschzetteleintrag): void {
        
    }

}