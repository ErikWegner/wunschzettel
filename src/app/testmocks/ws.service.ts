import { Injectable } from '@angular/core';

import { Wunschzetteleintrag, Category } from '../common';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class TestMockWunschzettelService {
  public itemsCount = 0;
  public categories$: Observable<Category[]>;

  private _categoriesObserver: Observer<Category[]>;

  constructor() {
    this.categories$ = new Observable<Category[]>(
      (observer: any) => this._categoriesObserver = observer
    ).share();
  }

  getItems() {
    this.itemsCount++;
  }
}
