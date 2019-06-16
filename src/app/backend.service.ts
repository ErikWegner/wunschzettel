import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, Item } from './domain';
import { ItemBuilder } from 'testing';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private mockdata: Item[] = [
    ItemBuilder.with().category('Buch').build(),
    ItemBuilder.with().category('Spiel').build(),
    ItemBuilder.with().category('Buch').build(),
    ItemBuilder.with().category('Buch').build(),
    ItemBuilder.with().category('Spiel').build(),
    ItemBuilder.with().category('Technik').build(),
    ItemBuilder.with().category('Medien').build(),
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
