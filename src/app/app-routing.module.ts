import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { AddPageComponent } from './pages/add-page/add-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ItemViewComponent } from './pages/item-view/item-view.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'wunschliste',
    component: CategoryPageComponent,
    data: { animation: 'CategoryPage' },
  },
  {
    path: 'wunschliste/:category',
    component: CategoryPageComponent,
    data: { animation: 'CategoryPage' },
  },
  {
    path: 'wunsch/:wunsch',
    component: ItemViewComponent,
    data: { animation: 'CategoryPage', action: 'navigatedToItem' },
  },
  {
    path: 'kategorien',
    component: CategoriesPageComponent,
    data: { animation: 'CategoriesPage' },
  },
  {
    path: 'add',
    component: AddPageComponent,
    data: { animation: 'AddPage' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: 'AboutPage' },
  },

  { path: '', redirectTo: '/wunschliste', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
