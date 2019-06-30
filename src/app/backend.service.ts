import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, Item, AddItemResponse } from './domain';
import { ItemBuilder } from 'testing';
import { CaptchaChallenge } from './domain/captcha-challenge';

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
        observer.next(new Result(JSON.parse(JSON.stringify(this.mockdata))));
        observer.complete();
      }, 1500);
    });
  }

  public getReservationFlag(id: number) {
    return new Observable<Result<boolean>>((observer) => {
      window.setTimeout(() => {
        observer.next(new Result(this.mockdata.find(i => i.id === id).isReserved));
        observer.complete();
      }, 1500);
    });
  }

  public setReservationFlag(id: number, flag: boolean, captchaAnswer: string) {
    return this.processCaptcha(captchaAnswer, () => {
      this.mockdata.find(i => i.id === id).isReserved = flag;
      return flag ? 'gesetzt' : 'gelöscht';
    });
  }

  public setItem(item: Item, captchaAnswer: string) {
    return this.processCaptcha(captchaAnswer, () => {
      const mockItem = this.mockdata.find(i => i.id === item.id) as Item;
      mockItem.title = item.title;
      mockItem.description = item.description;
      mockItem.category = item.category;
      mockItem.imagesrc = item.imagesrc;
      mockItem.buyurl = item.buyurl;

      return 'Gespeichert';
    });
  }

  public addItem(item: Item, captchaAnswer: string) {
    return new Observable<Result<AddItemResponse>>((observer) => {

      window.setTimeout(() => {
        if (captchaAnswer === 'FAIL') {
          observer.error('No response');
          return;
        }
        let response: AddItemResponse;
        let success = false;
        if (captchaAnswer === 'OK') {
          const nextId = this.mockdata.map(i => i.id).reduce((prev, cur) => Math.max(prev, cur)) + 1;
          item.id = nextId;
          this.mockdata.push(item);
          response = {
            message: 'Angelegt',
            id: nextId
          };
          success = true;
        } else {
          response = {
            message: 'Captcha falsch'
          };
        }
        observer.next(new Result(response, success));
        observer.complete();
      }, 1500);
    });
  }

  public deleteItem(id: number, captchaAnswer: string) {
    return this.processCaptcha(captchaAnswer, () => {
      const index = this.mockdata.findIndex(i => i.id === id);
      this.mockdata.splice(index, 1);

      return 'Gelöscht';
    });
  }

  public getCaptchaChallenge() {
    return new Observable<Result<CaptchaChallenge>>((observer) => {
      window.setTimeout(() => {
        observer.next(new Result(new CaptchaChallenge('Eingabe: OK, FAIL, sonstiges')));
        observer.complete();
      }, 1500);
    });
  }

  private processCaptcha(
    captchaAnswer: string,
    successCallback: () => string
  ) {
    return new Observable<Result<string>>((observer) => {

      window.setTimeout(() => {
        if (captchaAnswer === 'FAIL') {
          observer.error('No response');
          return;
        }
        let responseText: string;
        let success = false;
        if (captchaAnswer === 'OK') {
          responseText = successCallback();
          success = true;
        } else {
          responseText = 'Captcha falsch';
        }
        observer.next(new Result(responseText, success));
        observer.complete();
      }, 1500);
    });

  }
}
