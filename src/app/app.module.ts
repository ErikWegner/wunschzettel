import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
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
import { FrameComponent } from './frame/frame.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { agReducer } from './store/a.reducer';
import { AppState } from './store/app.state';
import { WishlistEffects } from './store/w.effects';
import { wReducer } from './store/w.reducer';
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    AboutComponent,
    CategoriesPageComponent,
    EmptyListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
