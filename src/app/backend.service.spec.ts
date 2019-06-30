import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BackendService } from './backend.service';
import { APP_MOCK_BACKEND } from './app.config';
import { ListBuilder, ItemBuilder, TestRandom } from 'testing';
import { ItemMapper } from 'testing/item-mapper';
import { Result } from './domain';
import { GetReservationFlagResponse } from './backend/get-reservation-flag-response';
import { SetReservationFlagResponse } from './backend';
import { Type } from '@angular/core';

describe('BackendService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let nextCallback: jasmine.Spy;
  let complCallback: jasmine.Spy;
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: APP_MOCK_BACKEND, useValue: false }]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    // see https://github.com/angular/angular/issues/29905
    httpTestingController = TestBed.get(HttpTestingController as Type<HttpTestingController>);

    service = TestBed.get(BackendService);

    nextCallback = jasmine.createSpy('next');
    complCallback = jasmine.createSpy('complete');
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

  it('should get all items', () => {
    // Arrange
    const items = ListBuilder.with(() => ItemBuilder.default()).items(5).build();

    // Act
    service.getItems().subscribe(nextCallback, fail, complCallback);

    // Assert
    const req = httpTestingController.expectOne(apiUrl('?action=list'));
    req.flush(ItemMapper.asServerResponse(items));

    expect(nextCallback).toHaveBeenCalledTimes(1);
    expect(complCallback).toHaveBeenCalledTimes(1);
    expect(nextCallback.calls.first().args[0]).toEqual(new Result(items));
  });

  [true, false].forEach(backendStatus => {
    it('should get reservation flag', () => {
      // Arrange
      const id = TestRandom.r(9000);

      // Act
      service.getReservationFlag(id).subscribe(nextCallback, fail, complCallback);

      // Assert
      const req = httpTestingController.expectOne(apiUrl('?action=status&id=' + id));
      req.flush({ data: { status: backendStatus } } as GetReservationFlagResponse);

      expect(nextCallback).toHaveBeenCalledTimes(1);
      expect(complCallback).toHaveBeenCalledTimes(1);
      expect(nextCallback.calls.first().args[0]).toEqual(new Result(backendStatus));
    });
  });

  [true, false].forEach(isSuccess => {

    [
      {
        action: 'reserve',
        desiredReservationFlag: true
      },
      {
        action: 'clear',
        desiredReservationFlag: false
      }
    ].forEach(testRunData => {
      it('should set reservation flag to ' + testRunData.desiredReservationFlag + ' with server response ' + isSuccess, () => {
        // Arrange
        const id = TestRandom.r(9000);
        const captchaAnswer = TestRandom.randomString(6, 'answer-');

        // Act
        service
          .setReservationFlag(id, testRunData.desiredReservationFlag, captchaAnswer)
          .subscribe(nextCallback, fail, complCallback);

        // Assert
        const req = httpTestingController.expectOne(apiUrl(`?action=${testRunData.action}&id=${id}&captcha=${captchaAnswer}`));
        req.flush({ data: { success: isSuccess, message: 'Server' } } as SetReservationFlagResponse);

        expect(nextCallback).toHaveBeenCalledTimes(1);
        expect(complCallback).toHaveBeenCalledTimes(1);
        expect(nextCallback.calls.first().args[0]).toEqual(new Result('Server', isSuccess));
      });
    });
  });
});
