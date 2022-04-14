import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
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
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditReservationDialogComponent } from './components/edit-reservation-dialog/edit-reservation-dialog.component';
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { ItemDisplayComponent } from './components/item-display/item-display.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ConnectFormDirective } from './directives/connect-form.directive';
import { FormEnabledDirective } from './directives/form-enabled.directive';
import { FrameComponent } from './frame/frame.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { agReducer } from './store/a.reducer';
import { AppState } from './store/app.state';
import { WishlistEffects } from './store/w.effects';
import { wReducer } from './store/w.reducer';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CategoriesPageComponent,
    ConnectFormDirective,
    EditReservationDialogComponent,
    EmptyListComponent,
    FormEnabledDirective,
    FrameComponent,
    ItemDisplayComponent,
    ItemFormComponent,
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    StoreModule.forRoot<AppState>({ ag: agReducer, wishlist: wReducer }),
    EffectsModule.forRoot([WishlistEffects]),
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
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
