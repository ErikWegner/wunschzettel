import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';
import { Result, Category, Item } from './domain';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  protected items: Item[];

  constructor(
    protected backend: BackendService
  ) { }

  public getCategories() {
    return this.loadItems()
      .pipe(map(this.extractCategories));
  }

  public getItemsByCategory(category: Category) {
    return this.loadItems()
      .pipe(map(items => this.filterByCategory(items, category)));
  }

  private filterByCategory(items: Result<Item[]>, category: Category): any {
    return new Result(items.data.filter(item => item.Category === category.value));
  }

  private extractCategories(result: Result<Item[]>) {
    const dict: { [c: string]: boolean } = {};
    const categories = result.data
      .map(i => i.Category)
      .filter(c => {
        return dict.hasOwnProperty(c) ? false : dict[c] = true;
      })
    .map (c => new Category(c));
    return new Result(categories);
  }

  private loadItems() {
    return new Observable<Result<Item[]>>((observer) => {
      if (this.items) {
        observer.next(new Result<Item[]>(this.items));
        observer.complete();
        return;
      }

      this.backend.getItems().subscribe(
        (result) => {
          this.items = result.data;
          observer.next(new Result<Item[]>(this.items));
          observer.complete();
        },
        observer.error,
        observer.complete
      );
    });
  }
}
