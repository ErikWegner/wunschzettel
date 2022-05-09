import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { WishlistItem } from 'src/app/business/item';
import { goToItem } from 'src/app/store/w.actions';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
})
export class ItemPreviewComponent {
  @Input()
  item: WishlistItem | null = null;

  constructor(private store: Store) {}

  public goToItem(): void {
    if (this.item) {
      this.store.dispatch(goToItem({ itemId: this.item.id }));
    }
  }
}
