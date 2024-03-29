import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { ItemsListComponent } from './pages/items-list/items-list.component';
import { ItemViewComponent } from './pages/item-view/item-view.component';
import { ItemEditComponent } from './pages/item-edit/item-edit.component';
import { ItemDeleteComponent } from './pages/item-delete/item-delete.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'categories/:category', component: ItemsListComponent },
  { path: 'items', component: ItemsListComponent },
  { path: 'items/add', component: ItemEditComponent },
  { path: 'items/:id', component: ItemViewComponent },
  { path: 'items/:id/edit', component: ItemEditComponent },
  { path: 'items/:id/delete', component: ItemDeleteComponent },
  { path: '404', component: PageNotFoundComponent },

  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
