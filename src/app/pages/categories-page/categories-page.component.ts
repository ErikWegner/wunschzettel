import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCategories } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
})
export class CategoriesPageComponent {
  categories$ = this.store.select(selectCategories);

  constructor(private store: Store) {}
}
