import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BackendService } from './backend.service';
import { APP_MOCK_BACKEND } from './app.config';
import { ListBuilder, ItemBuilder } from 'testing';
import { ListResponse } from './backend';
import { ItemMapper } from 'testing/item-mapper';

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
    httpTestingController = TestBed.get(HttpTestingController);

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
    expect(nextCallback.calls.first().args[0]).toEqual(items);
  });
});
