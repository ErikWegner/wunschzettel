import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { LoaderComponent } from './internal/loader/loader.component';
import { MessageComponent } from './internal/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CategoriesListComponent,
    ItemsListComponent,
    ItemViewComponent,
    ItemEditComponent,
    ItemDeleteComponent,
    PageNotFoundComponent,
    LoaderComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
