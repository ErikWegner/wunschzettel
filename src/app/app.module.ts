import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { ItemsListComponent } from './pages/items-list/items-list.component';
import { ItemViewComponent } from './pages/item-view/item-view.component';
import { ItemEditComponent } from './pages/item-edit/item-edit.component';
import { ItemDeleteComponent } from './pages/item-delete/item-delete.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { MessageComponent } from './components/message/message.component';
import { EditReservationDialogComponent } from './components/edit-reservation-dialog/edit-reservation-dialog.component';
import { BackendService } from './backend.service';
import { BackendServiceMock } from './backend.service.mock';
import { environment } from 'src/environments/environment';

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
    MessageComponent,
    EditReservationDialogComponent,
  ],
  entryComponents: [
    EditReservationDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpClientModule,
  ],
  providers: [
    { provide: BackendService, useClass: environment.production ? BackendService : BackendServiceMock }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
