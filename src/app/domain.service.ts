import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result, Category, Item, CaptchaResponse } from './domain';
import { BackendService } from './backend.service';
import { CaptchaChallenge } from './domain/captcha-challenge';

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

  public getItem(id: number) {
    return this.loadItems()
    .pipe(map(items => this.filterById(items, id)));
  }

  public getReservationFlag(id: number): Observable<Result<boolean>> {
    return this.backend.getReservationFlag(id);
  }

  public setReservationFlag(id: number, isReserved: boolean, captaResponse: CaptchaResponse): Observable<Result<string>> {
    throw new Error('Not implemeted');
  }

  public getCaptchaChallenge(): Observable<Result<CaptchaChallenge>> {
    return this.backend.getCaptchaChallenge();
  }

  private filterById(items: Result<Item[]>, id: number) {
    const item = items.data.find(i => i.id === id);
    return new Result(item);
  }

  private filterByCategory(items: Result<Item[]>, category: Category) {
    return new Result(items.data.filter(item => item.category === category.value));
  }

  private extractCategories(result: Result<Item[]>) {
    const dict: { [c: string]: boolean } = {};
    const categories = result.data
      .map(i => i.category)
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
