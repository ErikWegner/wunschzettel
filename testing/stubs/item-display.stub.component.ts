import { Component, Input } from '@angular/core';
import { WishlistItem } from 'src/app/business/item';

@Component({
  selector: 'app-item-display',
  template: `<div>app-item-display</div>
    <div class="title">{{ item?.Title }}</div>
    <div class="category">{{ item?.Category }}</div> `,
})
export class ItemDisplayStubComponent {
  @Input()
  item: WishlistItem | null = null;

  constructor() {}
}
