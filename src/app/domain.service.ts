import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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

  private extractCategories(result: Result<Item[]>) {
    const dict: { [c: string]: boolean } = {};
    const categories: string[] = result.data
      .map(i => i.Category)
      .filter(c => {
        return dict.hasOwnProperty(c) ? false : dict[c] = true;
      });
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
