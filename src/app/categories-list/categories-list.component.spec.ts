import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { CategoriesListComponent } from './categories-list.component';
import { TestAppLoaderComponent, ListBuilder, TestRandom, RouterLinkDirectiveStub } from '../../../testing/';
import { DomainService } from '../domain.service';
import { Result } from '../domain';
import { By } from '@angular/platform-browser';

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;
  let domainServiceStub: jasmine.SpyObj<DomainService>;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getCategories'
      ]
    );
    initTestScheduler();
    TestBed.configureTestingModule({
      declarations: [
        CategoriesListComponent,
        TestAppLoaderComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: DomainService, useValue: domainService }
      ]
    })
      .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
    domainServiceStub.getCategories.and.returnValue(
      cold('--x|', { x: new Result([]) })
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    resetTestScheduler();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get a list of categories from service', () => {
    fixture.detectChanges();

    expect(domainServiceStub.getCategories).toHaveBeenCalledTimes(1);
  });

  it('should display list of categories from service', () => {
    // Arrange
    const categories = ListBuilder.with(() => TestRandom.randomString(8)).items(3).build();
    domainServiceStub.getCategories.and.returnValue(
      cold('--x|', { x: new Result(categories) })
    );

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks.length).toBe(3);
    expect(routerLinks.map(r => r.linkParams)).toEqual(categories.map(c => '/categories/' + c));
  });
});
