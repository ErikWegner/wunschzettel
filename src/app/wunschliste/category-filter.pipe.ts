import { Pipe, PipeTransform } from '@angular/core';
import { Wunschzetteleintrag, Category } from '../common';

@Pipe({
  name: 'matchCategory',
  pure: false
})
export class MatchCategoryPipe implements PipeTransform {
  transform(allItems:Wunschzetteleintrag[], selectedCategory: Category) {
    if (!selectedCategory || selectedCategory.filter === Category.allItemsCategory().filter) {
      return allItems;
    }
    
    return allItems.filter(wunsch => selectedCategory.filter === wunsch.Category);
  }
}
