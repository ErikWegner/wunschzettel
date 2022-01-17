import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { AddItemResponse } from '../business/add-item-response';
import { WishlistItem } from '../business/item';
import { Result } from '../business/result';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private http: HttpClient) {}

  public getItems(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>('service.php');
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
    item: WishlistItem,
    captchaAnswer: string
  ): Observable<Result<string>> {
    return EMPTY;
  }

  public addItem(
    item: WishlistItem,
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
