import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Result, Item, AddItemResponse } from './domain';
import { CaptchaChallenge } from './domain';
import { ListResponse, ListResponseItem, ServerUpdateItemRequest, ServerUpdateItemResponse } from './backend';
import { GetReservationFlagResponse } from './backend';
import { SetReservationFlagResponse } from './backend';
import { ServerAddItemResponse } from './backend';
import { ServerAddItemRequest } from './backend/server-add-item-request';
import { ServerDeleteItemResponse } from './backend/server-delete-item-response';
import { GetCaptchaChallengeResponse } from './backend/get-captcha-challenge-response';

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
    return this.http.get<GetReservationFlagResponse>(this.apiUrl('status', { id })).pipe(
      map(r => new Result(r.data.status))
    );
  }

  public setReservationFlag(id: number, flag: boolean, captchaAnswer: string) {
    return this.http.get<SetReservationFlagResponse>(
      this.apiUrl(
        flag ? 'reserve' : 'clear', { id, captcha: captchaAnswer }
      )).pipe(
        map(r => new Result(r.data.message, r.data.success))
      );
  }

  public setItem(item: Item, captchaAnswer: string) {
    const body: ServerUpdateItemRequest = {
      action: 'update',
      captcha: captchaAnswer,
      item: {
        BuyUrl: item.buyurl,
        Category: item.category,
        Description: item.description,
        id: item.id,
        ImgageUrl: item.imagesrc,
        Title: item.title
      }
    };
    return this.http.post<ServerUpdateItemResponse>(this.apiUrl(''), body).pipe(
      map(r => new Result<string>(r.data.message, r.data.success))
    );
  }

  public addItem(item: Item, captchaAnswer: string) {
    const body: ServerAddItemRequest = {
      action: 'add',
      captcha: captchaAnswer,
      item: {
        BuyUrl: item.buyurl,
        Category: item.category,
        Description: item.description,
        id: 0,
        ImgageUrl: item.imagesrc,
        Title: item.title
      }
    };
    return this.http.post<ServerAddItemResponse>(this.apiUrl(''), body).pipe(
      map(r => new Result<AddItemResponse>({ message: r.data.message, id: r.data.id }, r.data.success))
    );
  }

  public deleteItem(id: number, captchaAnswer: string) {
    const body = {
      action: 'delete',
      captcha: captchaAnswer,
      id
    };
    return this.http.post<ServerDeleteItemResponse>(this.apiUrl(''), body).pipe(
      map(r => new Result(r.data.message, r.data.success))
    );
  }

  public getCaptchaChallenge() {
    return this.http.get<GetCaptchaChallengeResponse>(this.apiUrl('captcha')).pipe(
      map(r => new Result(new CaptchaChallenge(r.data.captchatext)))
    );
  }

  private apiUrl(action: string, options?: { id?: number, captcha?: string }) {
    let url = this.serviceUrl;
    if (action !== '') {
      url += '?action=' + action;

      if (options) {
        if (options.id) {
          url += '&id=' + options.id;
        }
        if (options.captcha) {
          url += '&captcha=' + encodeURIComponent(options.captcha);
        }
      }
    }

    return url;
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

    return item;
  }
}
