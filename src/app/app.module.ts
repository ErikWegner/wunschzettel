import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditReservationComponent } from './components/edit-reservation/edit-reservation.component';
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';
import { ItemDisplayComponent } from './components/item-display/item-display.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ItemPreviewComponent } from './components/item-preview/item-preview.component';
import { MenuNavlistComponent } from './components/menu-navlist/menu-navlist.component';
import { ConnectFormDirective } from './directives/connect-form.directive';
import { FormEnabledDirective } from './directives/form-enabled.directive';
import { FrameComponent } from './frame/frame.component';
import { AboutComponent } from './pages/about/about.component';
import { AddPageComponent } from './pages/add-page/add-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ItemViewComponent } from './pages/item-view/item-view.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { WithCategoryPipe } from './pipes/with-category.pipe';
import { AppGlobalStateEffects } from './store/a.effects';
import { agReducer } from './store/a.reducer';
import { AppState } from './store/app.state';
import { rReducer } from './store/r.reducer';
import { CustomSerializer } from './store/router/custom-route-serializer';
import { RouterEffects } from './store/router/effects';
import { WishlistEffects } from './store/w.effects';
import { wReducer } from './store/w.reducer';

@NgModule({
  declarations: [
    AboutComponent,
    AddPageComponent,
    AppComponent,
    CategoriesPageComponent,
    CategoryPageComponent,
    ConnectFormDirective,
    EditReservationComponent,
    EmptyListComponent,
    ErrorDisplayComponent,
    FormEnabledDirective,
    FrameComponent,
    ItemDisplayComponent,
    ItemFormComponent,
    ItemPreviewComponent,
    ItemViewComponent,
    MenuNavlistComponent,
    PageNotFoundComponent,
    WithCategoryPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    StoreModule.forRoot<AppState>({
      ag: agReducer,
      wishlist: wReducer,
      reservation: rReducer,
      router: routerReducer,
    }),
    EffectsModule.forRoot([
      AppGlobalStateEffects,
      WishlistEffects,
      RouterEffects,
    ]),
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
    }),
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
