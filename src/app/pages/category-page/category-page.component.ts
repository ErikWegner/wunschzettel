import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectHasPendingRequest } from 'src/app/store/a.selectors';
import { selectItems } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent {
  hasRequestPending$ = this.store.select(selectHasPendingRequest);
  items$ = this.store.select(selectItems);

  constructor(private store: Store) {}
}
