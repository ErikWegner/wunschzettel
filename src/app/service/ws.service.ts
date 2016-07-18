import { Injectable } from '@angular/core';
import { Http, Response, ResponseOptions } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';
import { MockBackend } from '@angular/http/testing';

import { Wunschzetteleintrag, Category } from '../common';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/share';

/** Result for getItemStatus */
export interface IStatusResponse {
  status: boolean;
}

/** Result for getCaptcha */
export interface ICaptchaResponse {
  captchatext: string;
}

/** A base interface for a response with a success flag and a message */
export interface ISuccessAndMessageResponse {
  success: boolean;
  message: string;
}

/** Result for reserveItem and clearReservation */
export interface IReserveResponse extends ISuccessAndMessageResponse {
}

/** Result for adding, updating or deleting an item */
export interface ICRUDResponse extends ISuccessAndMessageResponse {
  id?: number;
}

enum CRUDAction {
  Create,
  Update,
  Delete
}
@Injectable()
export class WunschzettelService {

  public categories$: Observable<Category[]>;
  public items$: Observable<Wunschzetteleintrag[]>;

  private _categoriesObserver: Observer<Category[]>;
  private _itemsObserver: Observer<Wunschzetteleintrag[]>;
  private _categories: Category[];
  private _items: Observable<Wunschzetteleintrag[]>;
  private serviceUrl = 'service.php';  // URL to web api

  private _data: {
    items: Wunschzetteleintrag[]
  };

  constructor(
    private http: Http,
    private backend: MockBackend,
    private location: Location
  ) {
    // https://coryrylan.com/blog/angular-2-observable-data-services
    this._data = { items: null };
    // init the observables for all consumers
    this.categories$ = new Observable<Category[]>(
      (observer: any) => this._categoriesObserver = observer
    ).share();
    this.items$ = new Observable<Wunschzetteleintrag[]>(
      (observer: any) => this._itemsObserver = observer
    ).publishReplay(1).refCount();

    // register a consumer for the items to update the categories
    this.items$.subscribe(items => {
      let oldCategories = JSON.stringify(this._categories);
      this._categories = null;
      this.extractCategories(items);
      if (JSON.stringify(this._categories) !== oldCategories) {
        this._categoriesObserver.next(this._categories);
      }
    });

    this.setupDevelopment();
  }

  /** Get a list of all available items */
  getItems() {
    if (!this._data.items) {
      this._data.items = []; // prevend to call the service twice 

      let response = this.http.get(this.serviceUrl + '?action=list')
        .map(this.extractData)
        .catch(this.handleError);
      response.subscribe(
        items => {
          this._data.items = items || [];
          this.publishItems();
        },
        error => { }
      );
    }
  }

  /** Get a list of categories */
  extractCategories(items: Wunschzetteleintrag[]): Category[] {
    if (!this._categories) {
      let r: Category[] = [];
      r.push(Category.allItemsCategory());
      items.forEach(item => {
        let itemCategory = new Category(item.Category);
        let isNewCategory = true;
        r.forEach(category => {
          isNewCategory = isNewCategory && category.equals(itemCategory) === false;
        });
        if (isNewCategory) {
          r.push(itemCategory);
        }
      });
      this._categories = r;
    }

    return this._categories;
  }

  /** Get the reservation status for an item */
  getItemStatus(id: number): Observable<IStatusResponse> {
    return this.http.get(this.serviceUrl + '?action=status&id=' + id)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Get the captcha data for the next request */
  getCaptcha(): Observable<ICaptchaResponse> {
    return this.http.get(this.serviceUrl + '?action=captcha')
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Set status to reserved */
  reserveItem(id: number, captcha: string): Observable<IReserveResponse> {
    return this.http.get(
      this.serviceUrl
      + '?action=reserve&id='
      + id
      + '&captcha='
      + encodeURIComponent(captcha))
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Set status to unreserved */
  clearReservation(id: number, captcha: string): Observable<IReserveResponse> {
    return this.http.get(
      this.serviceUrl
      + '?action=clear&id='
      + id
      + '&captcha='
      + encodeURIComponent(captcha))
      .map(this.extractData)
      .catch(this.handleError);
  }

  /** Add a new item */
  addItem(item: Wunschzetteleintrag, captchatext: string): Observable<ICRUDResponse> {
    return this.sendItem(CRUDAction.Create, item, captchatext);
  }
  /** Update an existing item */
  updateItem(item: Wunschzetteleintrag, captchatext: string): Observable<ICRUDResponse> {
    return this.sendItem(CRUDAction.Update, item, captchatext);
  }

  removeItem(id: number, captchatext: string): Observable<ICRUDResponse> {
    return Observable.create(
      (observer: any) => {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let request: Observable<ICRUDResponse> = this.http.post(
          this.serviceUrl,
          JSON.stringify({
            'action': 'delete',
            'captcha': captchatext,
            'id': id
          }), options)
          .map(this.extractData)
          .catch(this.handleError);

        request.subscribe(
          response => {
            if (response.success) {
              this._data.items = this._data.items.filter(i => i.id !== id);
              this.publishItems();
            }

            observer.next(response);
          }
          , error => {
            let err: ICRUDResponse = {
              success: false,
              message: error,
              id: 0
            };
            observer.next(err);
          }
        );
      }
    );
  }

  private sendItem(
    action: CRUDAction,
    item: Wunschzetteleintrag,
    captchatext: string
  ): Observable<ICRUDResponse> {
    return Observable.create(
      (observer: any) => {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let request: Observable<ICRUDResponse> = this.http.post(
          this.serviceUrl,
          JSON.stringify({
            'action': action === CRUDAction.Create
              ? 'add'
              : action === CRUDAction.Update
                ? 'update'
                : 'fail',
            'captcha': captchatext,
            'item': item
          }), options)
          .map(this.extractData)
          .catch(this.handleError);

        request.subscribe(
          response => {
            if (response.success) {
              item.Description = item.Description.replace(/\r/g, '').replace(/\n/g, '<br>');
              if (action === CRUDAction.Create) {
                item.id = response.id;
                this._data.items.push(item);
              }

              if (action === CRUDAction.Update) {
                let olditem = this._data.items.find(i => i.id === item.id);
                if (item) {
                  for (let key in item) {
                    if (item.hasOwnProperty(key)) {
                      olditem[key] = item[key];
                    }
                  }
                }
              }

              this.publishItems();
            }

            observer.next(response);
          }
          , error => {
            let err: ICRUDResponse = {
              success: false,
              message: error,
              id: 0
            };
            observer.next(err);
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

  private setupDevelopment() {
    if (ENV === 'development') {
      console.log('Using mock backend');
      let serviceRegex = /^service.php\?action=([a-z]+)&id=(\d+)$/i;

      let backendItems = [
        new Wunschzetteleintrag(1, 'Item 1', 'Desc', 'C1'),
        new Wunschzetteleintrag(2, 'Item 2', 'Desc Desc', 'C2'),
        new Wunschzetteleintrag(3, 'Item 3', 'Desc Desc Desc', 'C1'),
      ];
      let backendStatus = {
        'id1': true,
        'id2': false,
        'id3': false
      };

      let captcha = '4';
      this.backend.connections.subscribe(c => {
        let res = new ResponseOptions();
        res.body = {};
        res.status = 200;

        console.log(c.request.method + ': ' + c.request.url);

        if (c.request.url === 'service.php?action=list' && c.request.method === 0) {
          res.body = { data: backendItems };
        }

        if (c.request.url === 'service.php?action=captcha' && c.request.method === 0) {
          res.body = { data: { captchatext: 'vier' } };
        }

        // Test for actions with an id
        let matches = c.request.url.match(serviceRegex);
        if (matches && c.request.method === 0) {
          let action = matches[1];
          let id = matches[2];
          let item = backendItems.find(i => i.id === id);
          if (action === 'status') {
            res.body = { data: { status: backendStatus['id' + id] || false } };
          }
        }

        if (c.request.url === 'service.php' && c.request.method === 1) {
          let body = JSON.parse(c.request._body);
          console.log(body);
          if (body['action'] === 'add' && body['captcha'] === captcha) {
            let lastid = 0;
            backendItems.forEach(w => lastid = Math.max(lastid, w.id + 1));
            body['item'].id = lastid;
            backendItems.push(body['item']);

            res.body = {
              data: {
                success: true,
                message: 'Eintrag angelegt',
                id: lastid
              }
            };
          }
        }

        res.body = JSON.parse(JSON.stringify(res.body));
        c.mockRespond(new Response(res));
      });
    }
  }
}
