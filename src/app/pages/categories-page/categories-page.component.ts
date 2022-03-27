import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectHasPendingRequest } from 'src/app/store/a.selectors';
import { selectCategories } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
})
export class CategoriesPageComponent {
  categories$ = this.store.select(selectCategories);
  hasRequestPending$ = this.store.select(selectHasPendingRequest);

  constructor(private store: Store) {}
}
