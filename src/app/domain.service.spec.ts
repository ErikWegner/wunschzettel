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
        'deleteItem',
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

  it('can build a list of all items by unspecified category', () => {
    // Arrange
    const categories = ListBuilder.with(() => TestRandom.randomString(8)).items(3).build();
    const items = ListBuilder.with(
      (i) => ItemBuilder.with().category(categories[i % categories.length]).build()
    ).items(TestRandom.r(40, 20)).build();
    fakeBackend.getItems.and.returnValue(cold('--x|', { x: new Result(items) }));
    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.getItemsByCategory(Category.Unspecified).subscribe(
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
    expect(resultItems.data).toEqual(items);
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

  it('should send delete request to backend', () => {
    // Arrange
    const item = ItemBuilder.default();
    const answer = TestRandom.randomString(6, 'answer-');
    const captchaResponse = new CaptchaResponse(answer);
    fakeBackend.deleteItem.and.returnValue(cold('--x|', { x: new Result('OK') }));
    const service: DomainService = TestBed.get(DomainService);

    // Act
    service.deteleItem(item.id, captchaResponse).subscribe(
      nextCallback,
      fail,
      () => {
        completeCallback();
      }
    );
    getTestScheduler().flush(); // flush the observables

    // Assert
    expect(fakeBackend.deleteItem).toHaveBeenCalledWith(item.id, answer);
    expect(nextCallback).toHaveBeenCalledTimes(1);
    expect(completeCallback).toHaveBeenCalledTimes(1);
  });

  [
    {
      testname: 'should update',
      backendSuccess: true,
      shouldBeEqual: true,
      backendQueryCount: 2,
    },
    {
      testname: 'should not update',
      backendSuccess: false,
      shouldBeEqual: false,
      backendQueryCount: 1,
    }
  ].forEach(testRunData1 => {
    function setupSetItem() {
      fakeBackend.setItem.and.returnValue(
        cold(
          '--x|',
          {
            x: testRunData1.backendSuccess
              ? new Result('Success')
              : new Result('Backend refused', false)
          }));
    }

    function setupDeleteItem() {
      fakeBackend.deleteItem.and.returnValue(
        cold(
          '--x|',
          {
            x: testRunData1.backendSuccess
              ? new Result('Success')
              : new Result('Backend refused', false)
          }));
    }

    function setupGetItems(items: Item[]) {
      const clonedItems = items.map(item => ItemBuilder.from(item).build());
      fakeBackend.getItems.and.callFake(() => cold('--x|', { x: new Result(clonedItems) }));
    }

    it(testRunData1.testname + ' cache item on update', () => {
      // Arrange
      const items = ListBuilder.with(() => ItemBuilder.default()).items(TestRandom.r(40, 20)).build();
      const index = Math.floor(items.length * 0.8);
      const id = items[index].id;
      setupGetItems(items);
      setupSetItem();
      const service: DomainService = TestBed.get(DomainService);
      const newItem = ItemBuilder.with().id(id).title('title-after-update').build();

      // Act
      // Load items to cache
      service.getItem(id).subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update one item
      service.setItem(newItem, new CaptchaResponse('')).subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update item in backend
      items[index] = newItem;
      setupGetItems(items);
      // Reload item
      service.getItem(id).subscribe(
        nextCallback,
        fail,
        () => {
          completeCallback();
        }
      );
      getTestScheduler().flush(); // flush the observables

      // Assert
      expect(fakeBackend.getItems).toHaveBeenCalledTimes(testRunData1.backendQueryCount);
      expect(nextCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalledTimes(1);
      const resultItem: Result<Item> = nextCallback.calls.first().args[0];
      if (testRunData1.shouldBeEqual) {
        expect(resultItem.data).toEqual(newItem);
      } else {
        expect(resultItem.data).not.toEqual(newItem);
      }
    });

    it(testRunData1.testname + ' cache item for category on update', () => {
      // Arrange
      const categories = ListBuilder.with(() => TestRandom.randomString(8)).items(3).build();
      const items = ListBuilder.with(
        (i) => ItemBuilder.with().category(categories[i % categories.length]).build()
      ).items(TestRandom.r(40, 20)).build();
      setupGetItems(items);
      setupSetItem();
      const service: DomainService = TestBed.get(DomainService);
      const index = Math.floor(items.length * 0.8);
      const id = items[index].id;
      const newItem = ItemBuilder.with().id(id).category('category-after-update').build();

      // Act
      // Load items to cache
      service.getCategories().subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update one item
      service.setItem(newItem, new CaptchaResponse('')).subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update item in backend
      items[index] = newItem;
      setupGetItems(items);
      // Reload item
      service.getCategories().subscribe(
        nextCallback,
        fail,
        () => {
          completeCallback();
        }
      );
      getTestScheduler().flush(); // flush the observables

      // Assert
      expect(fakeBackend.getItems).toHaveBeenCalledTimes(testRunData1.backendQueryCount);
      expect(nextCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalledTimes(1);
      const resultCategories: Result<Category[]> = nextCallback.calls.first().args[0];
      if (testRunData1.shouldBeEqual) {
        expect(resultCategories.data.map(c => c.value)).toContain(newItem.category);
      } else {
        expect(resultCategories.data.map(c => c.value)).not.toContain(newItem.category);
      }
    });

    it(testRunData1.testname + ' cache item on delete', () => {
      // Arrange
      const items = ListBuilder.with(() => ItemBuilder.default()).items(TestRandom.r(40, 20)).build();
      const index = Math.floor(items.length * 0.8);
      const specialItem = items[index];
      const id = specialItem.id;
      setupGetItems(items);
      setupDeleteItem();
      const service: DomainService = TestBed.get(DomainService);

      // Act
      // Load items to cache
      service.getItem(id).subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update one item
      service.deteleItem(id, new CaptchaResponse('')).subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update item in backend
      items.splice(index, 1);
      setupGetItems(items);
      // Reload item
      service.getItem(id).subscribe(
        nextCallback,
        fail,
        () => {
          completeCallback();
        }
      );
      getTestScheduler().flush(); // flush the observables

      // Assert
      expect(fakeBackend.getItems).toHaveBeenCalledTimes(testRunData1.backendQueryCount);
      expect(nextCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalledTimes(1);
      const resultItem: Result<Item> = nextCallback.calls.first().args[0];
      if (testRunData1.backendSuccess) {
        expect(resultItem.data).toBeUndefined();
      } else {
        expect(resultItem.data).toEqual(specialItem);
      }
    });

    it(testRunData1.testname + ' cache item for category on delete', () => {
      // Arrange
      const categories = ListBuilder.with(() => TestRandom.randomString(8)).items(3).build();
      const items = ListBuilder.with(
        (i) => ItemBuilder.with().category(categories[i % categories.length]).build()
      ).items(TestRandom.r(40, 20)).build();
      const index = Math.floor(items.length * 0.8);
      const specialItem = items[index];
      const id = specialItem.id;
      specialItem.category = 'category-of-deleted-item';
      setupGetItems(items);
      setupDeleteItem();
      const service: DomainService = TestBed.get(DomainService);

      // Act
      // Load items to cache
      service.getCategories().subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update one item
      service.deteleItem(id, new CaptchaResponse('')).subscribe();
      getTestScheduler().flush(); // flush the observables
      // Update item in backend
      items.splice(index, 1);
      setupGetItems(items);
      // Reload item
      service.getCategories().subscribe(
        nextCallback,
        fail,
        () => {
          completeCallback();
        }
      );
      getTestScheduler().flush(); // flush the observables

      // Assert
      expect(fakeBackend.getItems).toHaveBeenCalledTimes(testRunData1.backendQueryCount);
      expect(nextCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalledTimes(1);
      const resultCategories: Result<Category[]> = nextCallback.calls.first().args[0];
      if (testRunData1.backendSuccess) {
        expect(resultCategories.data.map(c => c.value)).not.toContain(specialItem.category);
      } else {
        expect(resultCategories.data.map(c => c.value)).toContain(specialItem.category);
      }
    });

  });
});
