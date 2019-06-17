import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, Item } from './domain';
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
    return new Observable<Result<string>>((observer) => {
      window.setTimeout(() => {
        if (captchaAnswer === 'FAIL') {
          observer.error('No response');
          return;
        }
        let responseText: string;
        let success = false;
        if (captchaAnswer === 'OK') {
          this.mockdata.find(i => i.id === id).isReserved = flag;
          responseText = flag ? 'gesetzt' : 'gelöscht';
          success = true;
        } else {
          responseText = 'Captcha falsch';
        }
        observer.next(new Result(responseText, success));
        observer.complete();
      }, 1500);
    });
  }

  public getCaptchaChallenge() {
    return new Observable<Result<CaptchaChallenge>>((observer) => {
      window.setTimeout(() => {
        observer.next(new Result(new CaptchaChallenge('Math equation')));
        observer.complete();
      }, 1500);
    });
  }
}
