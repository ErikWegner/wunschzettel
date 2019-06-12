import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      .pipe(tap(this.extractCategories));
  }

  private extractCategories(result: Result<Item[]>) {
    const dict: { [c: string]: boolean } = {};
    return result.data
      .map(i => i.Category)
      .filter(c => {
        return dict.hasOwnProperty(c) ? false : dict[c] = true;
      });
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
