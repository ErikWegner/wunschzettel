import { Component, Input } from '@angular/core';
import { WishlistItem } from 'src/app/business/item';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
})
export class ItemPreviewComponent {
  @Input()
  item: WishlistItem | null = null;

  constructor() {}
}
