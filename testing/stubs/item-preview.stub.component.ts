import { Component, Input } from '@angular/core';
import { WishlistItem } from 'src/app/business/item';

@Component({
  selector: 'app-item-preview',
  template: '<div>app-item-preview</div>',
})
export class ItemPreviewStubComponent {
  @Input()
  item: WishlistItem | null = null;

  constructor() {}
}
