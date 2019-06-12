import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, Item } from './domain';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private mockdata: Item[] = [
    {
      Category: 'Buch'
    },
    {
      Category: 'Spiel'
    },
    {
      Category: 'Buch'
    },
  ];

  constructor() { }

  public getItems() {
    return new Observable<Result<Item[]>>((observer) => {
      window.setTimeout(() => {
        observer.next(new Result(this.mockdata));
        observer.complete();
      }, 1500);
    });
  }
}
