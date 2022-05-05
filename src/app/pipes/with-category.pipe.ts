import { NgIterable, Pipe, PipeTransform } from '@angular/core';
import { WishlistItem } from '../business/item';

@Pipe({
  name: 'withCategory',
})
export class WithCategoryPipe implements PipeTransform {
  transform(
    items: WishlistItem[] | null,
    category: string | null
  ): WishlistItem[] {
    if (items && items.length) {
      if (category === null) {
        return items;
      }
      return items.filter((item) => item.Category === category);
    }
    return [];
  }
}
