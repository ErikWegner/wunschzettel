import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';
import { DomainService } from './domain.service';
import { BackendService } from './backend.service';
import { ListBuilder, TestRandom, ItemBuilder } from 'testing';
import { Result } from './domain/result';

describe('DomainService', () => {
  let nextCallback: jasmine.Spy;
  let completeCallback: jasmine.Spy;
  let fakeBackend: jasmine.SpyObj<BackendService>;
  beforeEach(() => {
    const backend = jasmine.createSpyObj(
      'BackendService',
      ['getItems']
    );

    initTestScheduler();
    nextCallback = jasmine.createSpy('nextCallback');
    completeCallback = jasmine.createSpy('completeCallback');
    TestBed.configureTestingModule({
      providers: [
        DomainService,
        { provide: BackendService, useValue: backend }
      ]
    });
    fakeBackend = TestBed.get(BackendService);
  });

  afterEach(() => {
    resetTestScheduler();
  });

  it('should be created', () => {
    const service: DomainService = TestBed.get(DomainService);
    expect(service).toBeTruthy();
  });

  it('can build a list of categories', () => {
    // Arrange
    const categories = ListBuilder.with(() => TestRandom.randomString(8)).items(3).build();
    const items = ListBuilder.with(
      (i) => ItemBuilder.with().category(categories[i % categories.length]).build()
    ).items(TestRandom.r(40, 20)).build();
    fakeBackend.getItems.and.returnValue(cold('--x|', { x: new Result(items) }));
    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.getCategories().subscribe(
      nextCallback,
      fail,
      () => {
        completeCallback();
      }
    );
    getTestScheduler().flush(); // flush the observables

    // Assert
    expect(nextCallback).toHaveBeenCalledTimes(1);
    expect(completeCallback).toHaveBeenCalledTimes(1);
    const resultCategories: Result<string[]> = nextCallback.calls.first().args[0];
    expect(resultCategories.data).toEqual(categories);
  });
});
