import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { WishlistItem } from 'src/app/business/item';
import { retrieveReservationStatus } from 'src/app/store/r.actions';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss'],
})
export class ItemDisplayComponent implements OnChanges {
  @ViewChild(MatExpansionPanel)
  panel: MatExpansionPanel | null = null;

  @Input()
  item: WishlistItem | null = null;

  constructor(private store: Store) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.panel?.close();
  }

  onPanelOpened(): void {
    if (this.item) {
      this.store.dispatch(retrieveReservationStatus({ itemId: this.item.id }));
    }
  }
}
