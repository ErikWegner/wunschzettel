import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Result, Item, AddItemResponse } from './domain';
import { CaptchaChallenge } from './domain';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ListResponse, ListResponseItem } from './backend';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private serviceUrl = 'service.php';  // URL to web api

  constructor(
    private http: HttpClient
  ) {
  }

  public getItems() {
    return this.http.get<ListResponse>(this.apiUrl('list')).pipe(
      map(r => new Result<Item[]>(r.data.map(this.mapServerItemToItem))),
      catchError(this.handleError)
    );
  }

  public getReservationFlag(id: number) {
    return new Observable<Result<boolean>>((observer) => {
      observer.error('Not implemented');
    });
  }

  public setReservationFlag(id: number, flag: boolean, captchaAnswer: string) {
    return new Observable<Result<string>>((observer) => {
      observer.error('Not implemented');
    });
  }

  public setItem(item: Item, captchaAnswer: string) {
    return new Observable<Result<string>>((observer) => {
      observer.error('Not implemented');
    });
  }

  public addItem(item: Item, captchaAnswer: string) {
    return new Observable<Result<AddItemResponse>>((observer) => {
      observer.error('Not implemented');
    });
  }

  public deleteItem(id: number, captchaAnswer: string) {
    return new Observable<Result<string>>((observer) => {
      observer.error('Not implemented');
    });
  }

  public getCaptchaChallenge() {
    return new Observable<Result<CaptchaChallenge>>((observer) => {
      observer.error('Not implemented');
    });
  }

  private apiUrl(action: string) {
    return this.serviceUrl + '?action=' + action;
  }

  private handleError(error: HttpErrorResponse) {
    const r = new Result<any>(null, false);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      r.data = 'An error occurred: ' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      r.data = `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`;
    }
    // return an observable with a user-facing error message
    return throwError(r);
  }

  private mapServerItemToItem(serverItem: ListResponseItem): Item {
    const item = new Item();

    item.id = serverItem.id;
    item.title = serverItem.Title;
    item.category = serverItem.Category;
    item.imagesrc = serverItem.ImgageUrl;
    item.buyurl = serverItem.BuyUrl;
    item.description = serverItem.Description;
    item.isReserved = false;

    return item;
  }
}
