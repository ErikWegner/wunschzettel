import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Observable }          from 'rxjs/Observable';

export interface IStatusResponse {
  status: boolean
}

export interface ICaptchaResponse {
  captchatext: string
}

export interface IReserveResponse {
  success: boolean
  message: string
}

@Injectable()
export class WunschzettelService {
  constructor(private http: Http) { }
  private serviceUrl = 'service.php';  // URL to web api
  
  /** Get a list of all available items */
  getItems(): Observable<Wunschzetteleintrag[]> {
    return this.http.get(this.serviceUrl + "?action=list")
      .map(this.extractData)
      .catch(this.handleError);
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

  reserveItem(id: number, captcha: string): Observable<IReserveResponse> {
    return this.http.get(this.serviceUrl + "?action=reserve&id=" + id + "&captcha=" + encodeURIComponent(captcha))
      .map(this.extractData)
      .catch(this.handleError);
  }

  clearReservation(id: number, captcha: string): Observable<IReserveResponse> {
    return this.http.get(this.serviceUrl + "?action=clear&id=" + id + "&captcha=" + encodeURIComponent(captcha))
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