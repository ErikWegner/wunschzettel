import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, map, Observable, shareReplay } from 'rxjs';
import { AddItemResponse } from '../business/add-item-response';
import { WishlistItem } from '../business/item';
import { Result } from '../business/result';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private cachedItems$: Observable<WishlistItem[]> | null = null;

  constructor(private http: HttpClient) {}

  public getItems(): Observable<WishlistItem[]> {
    if (!this.cachedItems$) {
      this.cachedItems$ = this.http
        .get<{ data: WishlistItem[] }>('service.php?action=list')
        .pipe(
          map((d) => d.data),
          shareReplay(1)
        );
    }
    return this.cachedItems$;
  }

  public getReservationFlag(id: number): Observable<boolean> {
    return this.http
      .get<{ data: { status: boolean } }>(`service.php?action=status&id=${id}`)
      .pipe(map((d) => d.data.status));
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
    throw new Error('Not implemented');
  }
}
