// Http testing module and mocking controller
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { ListBuilder } from 'testing/list-builder';
import { WishlistItemBuilder } from 'testing/item.builder';

import { ItemsService } from './items.service';
import { randomNumber, randomString } from 'testing/utils';
import { Result } from '../business/result';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let subscribeCallbacks: {
    next: jasmine.Spy;
    error: jasmine.Spy;
    complete: jasmine.Spy;
  };

  beforeEach(() => {
    subscribeCallbacks = {
      next: jasmine.createSpy('next'),
      error: jasmine.createSpy('error'),
      complete: jasmine.createSpy('comlete'),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ItemsService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  function apiUrl(path: string) {
    return 'service.php' + path;
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve list of items', () => {
    // Arrange
    const items = ListBuilder.with(WishlistItemBuilder.default)
      .items(3)
      .build();

    // Act
    service.getItems().subscribe(subscribeCallbacks);

    // Assert
    const req = httpTestingController.expectOne('service.php?action=list');
    expect(req.request.method).toEqual('GET');
    req?.flush({ data: items });
    expect(subscribeCallbacks.next).toHaveBeenCalledOnceWith(items);
    expect(subscribeCallbacks.error).not.toHaveBeenCalled();
    expect(subscribeCallbacks.complete).toHaveBeenCalledTimes(1);
  });

  [{ i: true }, { i: false }].forEach((testSetup) => {
    it(`should retrieve reservation status ${testSetup.i} of an item`, () => {
      // Arrange
      const id = randomNumber(400);

      // Act
      service.getReservationFlag(id).subscribe(subscribeCallbacks);

      // Assert
      const req = httpTestingController.expectOne(
        'service.php?action=status&id=' + id
      );
      expect(req.request.method).toEqual('GET');
      req?.flush({ data: { status: testSetup.i } });
      expect(subscribeCallbacks.next).toHaveBeenCalledOnceWith(testSetup.i);
      expect(subscribeCallbacks.error).not.toHaveBeenCalled();
      expect(subscribeCallbacks.complete).toHaveBeenCalledTimes(1);
    });
  });

  it('should request captcha challenge', () => {
    // Arrange
    const captchaChallengeText = randomString(6, 'challenge-');

    // Act
    service.getCaptchaChallenge().subscribe(subscribeCallbacks);

    // Assert
    const req = httpTestingController.expectOne(apiUrl('?action=captcha'));
    req.flush({ data: { captchatext: captchaChallengeText } });

    expect(subscribeCallbacks.next).toHaveBeenCalledTimes(1);
    expect(subscribeCallbacks.error).toHaveBeenCalledTimes(0);
    expect(subscribeCallbacks.complete).toHaveBeenCalledTimes(1);
    expect(subscribeCallbacks.next.calls.first().args[0]).toEqual(
      new Result(captchaChallengeText)
    );
  });

  it('should handle captcha server failure', () => {
    // Act
    service.getCaptchaChallenge().subscribe(subscribeCallbacks);

    // Assert
    const req = httpTestingController.expectOne(apiUrl('?action=captcha'));
    req.flush('502: Service unavailable', {
      status: 502,
      statusText: 'Service unavailable',
    });

    expect(subscribeCallbacks.next).toHaveBeenCalledTimes(1);
    expect(subscribeCallbacks.error).toHaveBeenCalledTimes(0);
    expect(subscribeCallbacks.complete).toHaveBeenCalledTimes(1);
    expect(subscribeCallbacks.next.calls.first().args[0]).toEqual(
      new Result('', false)
    );
  });

  it('should handle captcha network failure', () => {
    // Act
    service.getCaptchaChallenge().subscribe(subscribeCallbacks);

    // Assert
    const req = httpTestingController.expectOne(apiUrl('?action=captcha'));
    req.error(new ProgressEvent('error'));

    expect(subscribeCallbacks.next).toHaveBeenCalledTimes(1);
    expect(subscribeCallbacks.error).toHaveBeenCalledTimes(0);
    expect(subscribeCallbacks.complete).toHaveBeenCalledTimes(1);
    expect(subscribeCallbacks.next.calls.first().args[0]).toEqual(
      new Result('', false)
    );
  });
});
