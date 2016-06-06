import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { Observable }          from 'rxjs/Observable';

/** Result for getItemStatus */
export interface IStatusResponse {
  status: boolean
}

/** Result for getCaptcha */
export interface ICaptchaResponse {
  captchatext: string
}

/** A base interface for a response with a success flag and a message */
export interface ISuccessAndMessageResponse {
  success: boolean
  message: string
}

/** Result for reserveItem and clearReservation */
export interface IReserveResponse extends ISuccessAndMessageResponse {
}

/** Result for adding, updating or deleting an item */
export interface ICRUDResponse extends ISuccessAndMessageResponse {
  id?: number
}

@Injectable()
export class WunschzettelService {
  private serviceUrl = 'service.php';  // URL to web api

  private _items: Observable<Wunschzetteleintrag[]>
  private _categories: Category[]

  constructor(private http: Http) {
  }

  /** Get a list of all available items */
  getItems(): Observable<Wunschzetteleintrag[]> {
    if (!this._items) {
      this._items = this.http.get(this.serviceUrl + "?action=list")
        .map(this.extractData)
        .catch(this.handleError)
        .publishReplay(1)
        .refCount();
    }

    return this._items;
  }

  /** Get a list of categories */
  extractCategories(items: Wunschzetteleintrag[]): Category[] {
    if (!this._categories) {
      var r: Category[] = [];
      r.push(Category.allItemsCategory());
      items.forEach(item => {
        var itemCategory = new Category(item.Category);
        var isNewCategory = true;
        r.forEach(category => {
          isNewCategory = isNewCategory && category.equals(itemCategory) === false;
        });
        if (isNewCategory) {
          r.push(itemCategory);
        }
      });
      this._categories = r;
    }

    return this._categories
  }

  /** Get the reservation status for an item */
  getItemStatus(id: number): Observable<IStatusResponse> {
    return this.http.get(this.serviceUrl + "?action=status&id=" + id)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Get the captcha data for the next request */
  getCaptcha(): Observable<ICaptchaResponse> {
    return this.http.get(this.serviceUrl + "?action=captcha")
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Set status to reserved */
  reserveItem(id: number, captcha: string): Observable<IReserveResponse> {
    return this.http.get(this.serviceUrl + "?action=reserve&id=" + id + "&captcha=" + encodeURIComponent(captcha))
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Set status to unreserved */
  clearReservation(id: number, captcha: string): Observable<IReserveResponse> {
    return this.http.get(this.serviceUrl + "?action=clear&id=" + id + "&captcha=" + encodeURIComponent(captcha))
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Add a new item */
  addItem(item: Wunschzetteleintrag, captchatext: string): Observable<ICRUDResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(
      this.serviceUrl,
      JSON.stringify({
        'action': 'add',
        'captcha': captchatext,
        'item': item
      }), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}