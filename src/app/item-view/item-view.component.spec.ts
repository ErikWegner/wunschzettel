import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemViewComponent } from './item-view.component';
import { ActivatedRouteStub, RouterLinkDirectiveStub, ActivatedRoute, ItemBuilder, TestRandom, TestAppLoaderComponent } from 'testing';
import { DomainService } from '../domain.service';
import { Result } from '../domain';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { By } from '@angular/platform-browser';

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
      declarations: [
        ItemViewComponent,
        TestAppLoaderComponent,
        RouterLinkDirectiveStub
      ],
      imports: [CustomMaterialModule],
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
      cold('--x|', { x: new Result(null) })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  function prepareViewData() {
    const id = TestRandom.r(9000, 4000);
    const item = ItemBuilder.with().id(id).build();
    activatedRoute.setParamMap({ id });
    domainServiceStub.getItem.and.returnValue(
      cold('--x|', { x: new Result(item) })
    );
    return { id, item };
  }

  function initItemView() {
    prepareViewData();
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();
  }

  function revealStatus() {
    fixture.debugElement.query(By.css('mat-card-actions button:nth-child(1)')).nativeElement.click();
    fixture.detectChanges();
  }

  it('should get item by id', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(domainServiceStub.getItem).toHaveBeenCalledWith(viewData.id);
  });

  it('should show title of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toBe(viewData.item.title);
  });

  it('should show status only after action click', () => {
    // Arrange
    initItemView();
    const itemviewDe = fixture.debugElement;
    const rstatusPreClickDe = itemviewDe.queryAll(By.css('.rstatus'));

    // Act
    revealStatus();

    // Assert
    const rstatusPostClickDe = itemviewDe.queryAll(By.css('.rstatus'));
    expect(rstatusPostClickDe.length).toBe(1, 'Element should exist after click');
    expect(rstatusPreClickDe.length).toBe(0, 'Element must not exist before click');
  });

  it('should disable button after click', () => {
    // Arrange
    initItemView();
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('mat-card-actions button')).nativeElement;
    const preClickState = button.disabled;

    // Act
    revealStatus();

    // Assert
    expect(button.disabled).toBeTruthy('Should be disabled after click');
    expect(preClickState).toBeFalsy('Should be enabled');
  });

  [
    {
      testName: 'should show action to unreserve after click',
      isReservedValue: true,
      buttonText: 'Reservierung löschen'
    },
    {
      testName: 'should show action to reserve after click',
      isReservedValue: false,
      buttonText: 'Reservieren'
    }
  ].forEach(testRunData => {
    it(testRunData.testName, () => {
      // Arrange
      initItemView();
      fixture.componentInstance.item.isReserved = testRunData.isReservedValue;
      const preClickCount = fixture.nativeElement.querySelectorAll('mat-card-actions button').length;

      // Act
      revealStatus();

      // Assert
      expect(preClickCount).toBe(1, 'Button must not exist before click');

      const postClickCount = fixture.nativeElement.querySelectorAll('mat-card-actions button').length;
      expect(postClickCount).toBe(2, 'Button should exist after click');

      const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('mat-card-actions button')[1];
      expect(button.textContent).toBe(testRunData.buttonText);
    });
  });
});
