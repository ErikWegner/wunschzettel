import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemViewComponent } from './item-view.component';
import { ActivatedRouteStub, RouterLinkDirectiveStub, ActivatedRoute, ItemBuilder, TestRandom } from 'testing';
import { DomainService } from '../domain.service';
import { Result } from '../domain';

describe('ItemViewComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;
  let activatedRoute: ActivatedRouteStub;
  let domainServiceStub: jasmine.SpyObj<DomainService>;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getItem'
      ]
    );
    initTestScheduler();
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ ItemViewComponent, RouterLinkDirectiveStub],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DomainService, useValue: domainService }
      ]
    })
    .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    resetTestScheduler();
  });

  it('should create', () => {
    domainServiceStub.getItem.and.returnValue(
      cold('--x|', {x: new Result(null)})
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get item by id', () => {
    // Arrange
    const id = TestRandom.r(9000, 4000);
    const item = ItemBuilder.with().id(id).build();
    activatedRoute.setParamMap({ id });
    domainServiceStub.getItem.and.returnValue(
      cold('--x|', {x: new Result(item)})
    );

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(domainServiceStub.getItem).toHaveBeenCalledWith(item.id);
  });
});
