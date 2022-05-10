import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectHasPendingRequest } from 'src/app/store/a.selectors';
import { selectActiveItem } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
})
export class ItemViewComponent {
  hasRequestPending$ = this.store.select(selectHasPendingRequest);
  item$ = this.store.select(selectActiveItem);
  constructor(private store: Store) {}
}
