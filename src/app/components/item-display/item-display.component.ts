import { Component, Input, OnInit } from '@angular/core';
import { WishlistItem } from 'src/app/business/item';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss'],
})
export class ItemDisplayComponent {
  @Input()
  item: WishlistItem | null = null;

  constructor() {}
}
