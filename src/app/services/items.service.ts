import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { AddItemResponse } from '../business/add-item-response';
import { Item } from '../business/item';
import { Result } from '../business/result';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor() {}

  public getItems(): Observable<Item[]> {
    return EMPTY;
  }

  public getReservationFlag(id: number): Observable<boolean> {
    return EMPTY;
  }

  public setReservationFlag(
    id: number,
    flag: boolean,
    captchaAnswer: string
  ): Observable<Result<string>> {
    return EMPTY;
  }

  public setItem(
    item: Item,
    captchaAnswer: string
  ): Observable<Result<string>> {
    return EMPTY;
  }

  public addItem(
    item: Item,
    captchaAnswer: string
  ): Observable<Result<AddItemResponse>> {
    return EMPTY;
  }

  public deleteItem(
    id: number,
    captchaAnswer: string
  ): Observable<Result<string>> {
    return EMPTY;
  }

  public getCaptchaChallenge(): Observable<Result<string>> {
    return EMPTY;
  }
}
