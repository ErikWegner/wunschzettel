import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';

const routes: Routes = [
  { path: 'wunschliste', component: CategoriesPageComponent, data: { animation: 'CategoriesPage' } },
  { path: 'about', component: AboutComponent, data: { animation: 'AboutPage' } },

  { path: '', redirectTo: '/wunschliste', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
