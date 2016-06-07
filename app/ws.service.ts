import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { Observable }          from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/share';

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

  //https://coryrylan.com/blog/angular-2-observable-data-services
  public categories$: Observable<Category[]>
  public items$: Observable<Wunschzetteleintrag[]>

  private _categoriesObserver: Observer<Category[]>
  private _itemsObserver: Observer<Wunschzetteleintrag[]>

  private _data: {
    items: Wunschzetteleintrag[]
  }

  constructor(private http: Http) {
    this._data = { items: null };
    // init the observables for all consumers
    this.categories$ = new Observable((observer: any) => this._categoriesObserver = observer).share();
    this.items$ = new Observable((observer: any) => this._itemsObserver = observer).publishReplay(1).refCount();

    // register a consumer for the items to update the categories
    this.items$.subscribe(items => {
      var oldCategories = JSON.stringify(this._categories);
      this._categories = null;
      this.extractCategories(items);
      if (JSON.stringify(this._categories) != oldCategories) {
        this._categoriesObserver.next(this._categories);
      }
    });
  }

  /** Get a list of all available items */
  getItems() {
    if (!this._data.items) {
      this._data.items = []; // prevend to call the service twice 

      var response = this.http.get(this.serviceUrl + "?action=list")
        .map(this.extractData)
        .catch(this.handleError)
      response.subscribe(
        items => {
          this._data.items = items;
          this.publishItems();
        },
        error => { }
      );
    }
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
    return Observable.create(
      (observer: any) => {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var request: Observable<ICRUDResponse> = this.http.post(
          this.serviceUrl,
          JSON.stringify({
            'action': 'add',
            'captcha': captchatext,
            'item': item
          }), options)
          .map(this.extractData)
          .catch(this.handleError);

        request.subscribe(
          response => {
            if (response.success) {
              item.id = response.id;
              this._data.items.push(item);
              this.publishItems();
            }
            
            observer.next(response);
          }
        );
      }
    );
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

  private publishItems() {
    this._itemsObserver.next(this._data.items);
  }
}