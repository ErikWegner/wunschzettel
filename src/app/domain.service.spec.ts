import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';
import { DomainService } from './domain.service';
import { BackendService } from './backend.service';
import { ListBuilder, TestRandom, ItemBuilder } from 'testing';
import { Result } from './domain/result';
import { Category } from './domain/category';
import { Item } from './domain/item';
import { CaptchaChallenge } from './domain/captcha-challenge';
import { CaptchaResponse } from './domain/captcha-response';

describe('DomainService', () => {
  let nextCallback: jasmine.Spy;
  let completeCallback: jasmine.Spy;
  let fakeBackend: jasmine.SpyObj<BackendService>;
  beforeEach(() => {
    const backend = jasmine.createSpyObj(
      'BackendService',
      [
        'getItems',
        'getReservationFlag',
        'setReservationFlag',
        'setItem',
        'getCaptchaChallenge',
      ]
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
    const resultCategories: Result<Category[]> = nextCallback.calls.first().args[0];
    expect(resultCategories.data.map(c => c.value)).toEqual(categories);
  });

  it('can build a list of items by categories', () => {
    // Arrange
    const categories = ListBuilder.with(() => TestRandom.randomString(8)).items(3).build();
    const items = ListBuilder.with(
      (i) => ItemBuilder.with().category(categories[i % categories.length]).build()
    ).items(TestRandom.r(40, 20)).build();
    fakeBackend.getItems.and.returnValue(cold('--x|', { x: new Result(items) }));
    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.getItemsByCategory(new Category(categories[0])).subscribe(
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
    const resultItems: Result<Item[]> = nextCallback.calls.first().args[0];
    resultItems.data.every(item => expect(item.category).toBe(categories[0]));
  });

  it('can load an item', () => {
    // Arrange
    const items = ListBuilder.with(() => ItemBuilder.default()).items(TestRandom.r(40, 20)).build();
    const index = Math.floor(items.length * 0.8);
    const id = items[index].id;
    fakeBackend.getItems.and.returnValue(cold('--x|', { x: new Result(items) }));
    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.getItem(id).subscribe(
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
    const resultItem: Result<Item> = nextCallback.calls.first().args[0];
    expect(resultItem.data).toBe(items[index]);
  });

  it('should get reservation status from backend', () => {
    // Arrange
    const backendValue = true;
    const id = TestRandom.r(9000, 100);
    fakeBackend.getReservationFlag.and.returnValue(cold('--x|', { x: new Result(backendValue) }));
    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.getReservationFlag(id).subscribe(
      nextCallback,
      fail,
      () => {
        completeCallback();
      }
    );
    getTestScheduler().flush(); // flush the observables

    // Assert
    expect(fakeBackend.getReservationFlag).toHaveBeenCalledWith(id);
    expect(nextCallback).toHaveBeenCalledTimes(1);
    expect(completeCallback).toHaveBeenCalledTimes(1);
    const resultValue: Result<boolean> = nextCallback.calls.first().args[0];
    expect(resultValue.data).toBe(backendValue);
  });

  it('should get captcha challenge from backend', () => {
    // Arrange
    const captchaText = TestRandom.randomString(8);
    fakeBackend.getCaptchaChallenge.and.returnValue(
      cold('--x|', { x: new Result(new CaptchaChallenge(captchaText)) }));

    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.getCaptchaChallenge().subscribe(
      nextCallback,
      fail,
      () => {
        completeCallback();
      }
    );
    getTestScheduler().flush(); // flush the observables

    // Assert
    expect(fakeBackend.getCaptchaChallenge).toHaveBeenCalledTimes(1);
    expect(nextCallback).toHaveBeenCalledTimes(1);
    expect(completeCallback).toHaveBeenCalledTimes(1);
    const resultValue: Result<CaptchaChallenge> = nextCallback.calls.first().args[0];
    expect(resultValue.data.text).toBe(captchaText);
  });

  [true, false].forEach(flag => {
    it('should send request to change reservation state to backend', () => {
      // Arrange
      const id = TestRandom.r(9000, 100);
      const answer = TestRandom.randomString(6, 'answer-');
      const captchaResponse = new CaptchaResponse(answer);
      fakeBackend.setReservationFlag.and.returnValue(cold('--x|', { x: new Result('OK') }));
      const service: DomainService = TestBed.get(DomainService);

      // Act
      service.setReservationFlag(id, flag, captchaResponse).subscribe(
        nextCallback,
        fail,
        () => {
          completeCallback();
        }
      );
      getTestScheduler().flush(); // flush the observables

      // Assert
      expect(fakeBackend.setReservationFlag).toHaveBeenCalledWith(id, flag, answer);
      expect(nextCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('should send item update to backend', () => {
    // Arrange
    const item = ItemBuilder.default();
    const answer = TestRandom.randomString(6, 'answer-');
    const captchaResponse = new CaptchaResponse(answer);
    fakeBackend.setItem.and.returnValue(cold('--x|', { x: new Result('OK') }));
    const service: DomainService = TestBed.get(DomainService);
      
    // Act
    service.setItem(item, captchaResponse).subscribe(
      nextCallback,
      fail,
      () => {
        completeCallback();
      }
    );
    getTestScheduler().flush(); // flush the observables

     // Assert
     expect(fakeBackend.setItem).toHaveBeenCalledWith(item, answer);
     expect(nextCallback).toHaveBeenCalledTimes(1);
     expect(completeCallback).toHaveBeenCalledTimes(1);
 });
});
