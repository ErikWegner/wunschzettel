import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemsListComponent } from './items-list.component';
import {
  ActivatedRouteStub,
  ActivatedRoute,
  ItemBuilder,
  ListBuilder,
  RouterLinkDirectiveStub,
  TestRandom,
} from 'testing';
import { DomainService } from '../../domain.service';
import { Result, Category } from '../../domain';
import { By } from '@angular/platform-browser';
import { CustomMaterialModule } from '../../custom-material/custom-material.module';
import { Router, NavigationExtras } from '@angular/router';
import { TestingModule } from 'src/app/testing.module';

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
    const routerSpy = jasmine.createSpyObj(
      'Router',
      [
        'navigate'
      ]
    );
    initTestScheduler();
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [
        ItemsListComponent,
      ],
      imports: [
        CustomMaterialModule,
        TestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DomainService, useValue: domainService },
        { provide: Router, useValue: routerSpy },
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
    domainServiceStub.getItemsByCategory.and.returnValue(cold('--x|', { x: new Result([]) }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  function prepareView() {
    const category = TestRandom.randomString(8) + ' ' + TestRandom.randomString(4);
    const items = ListBuilder.with(
      () => ItemBuilder.with().category(category).build()
    ).items(TestRandom.r(40, 20)).build();
    activatedRoute.setParamMap({ category });
    domainServiceStub.getItemsByCategory.and.returnValue(
      cold('--x|', { x: new Result(items) })
    );
    return {
      category,
      items
    };
  }

  it('should get items by category', () => {
    // Arrange
    const viewData = prepareView();
    const category = viewData.category;

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(domainServiceStub.getItemsByCategory).toHaveBeenCalledWith(new Category(category));
  });

  it('should display list of items', () => {
    // Arrange
    const viewData = prepareView();
    const items = viewData.items;

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks.length).toBe(items.length);
    expect(routerLinks.map(r => r.linkParams)).toEqual(items.map(item => ['/items', item.id]));
  });

  it('should show 404 when category does not exist', () => {
    // Arrange
    domainServiceStub.getItemsByCategory.and.returnValue(
      cold('--x|', { x: new Result(null) })
    );
    activatedRoute.setParamMap({ category: 'not-existing' });
    const router = TestBed.get(Router) as jasmine.SpyObj<Router>;

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate.calls.mostRecent().args[0]).toEqual(['/404'], { skipLocationChange: true } as NavigationExtras);
  });
});
