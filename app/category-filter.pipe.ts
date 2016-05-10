import { Pipe, PipeTransform } from '@angular/core';
import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';

@Pipe({
  name: 'matchCategory',
  pure: false
})
export class MatchCategoryPipe implements PipeTransform {
  transform(allItems:Wunschzetteleintrag[], selectedCategory: Category) {
    if (!selectedCategory || selectedCategory.filter === "") {
      return allItems;
    }
    
    return allItems.filter(wunsch => selectedCategory.filter === wunsch.Category);
  }
}
