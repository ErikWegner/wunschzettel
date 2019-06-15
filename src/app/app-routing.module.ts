import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ItemsListComponent } from './items-list/items-list.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'categories/:category', component: ItemsListComponent },

  { path: '', redirectTo: '/categories', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
