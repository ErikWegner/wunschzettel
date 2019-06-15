import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemsListComponent } from './items-list.component';
import { ActivatedRouteStub, ActivatedRoute, TestRandom, ItemBuilder, ListBuilder } from 'testing';
import { DomainService } from '../domain.service';
import { Result, Category } from '../domain';

describe('ItemsListComponent', () => {
  let component: ItemsListComponent;
  let fixture: ComponentFixture<ItemsListComponent>;
  let activatedRoute: ActivatedRouteStub;
  let domainServiceStub: jasmine.SpyObj<DomainService>;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getItemsByCategory'
      ]
    );
    initTestScheduler();
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ ItemsListComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DomainService, useValue: domainService }
      ]
    })
    .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    resetTestScheduler();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get items by category', () => {
    // Arrange
    const category = TestRandom.randomString(8) + ' ' + TestRandom.randomString(4);
    const items = ListBuilder.with(
      () => ItemBuilder.with().category(category).build()
    ).items(TestRandom.r(40, 20)).build();
    activatedRoute.setParamMap({ category });
    domainServiceStub.getItemsByCategory.and.returnValue(
      cold('--x|', {x: new Result(items)})
    );

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(domainServiceStub.getItemsByCategory).toHaveBeenCalledWith(new Category(category));
  });
});
