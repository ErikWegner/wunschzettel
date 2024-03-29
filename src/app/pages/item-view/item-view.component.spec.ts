import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemViewComponent } from './item-view.component';
import { ActivatedRouteStub, ActivatedRoute, ItemBuilder, TestRandom } from 'testing';
import { DomainService } from '../../domain.service';
import { Result } from '../../domain';
import { CustomMaterialModule } from '../../custom-material/custom-material.module';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EditReservationDialogComponent } from 'src/app/components/edit-reservation-dialog/edit-reservation-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { TestingModule } from 'src/app/testing.module';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

describe('ItemViewComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;
  let activatedRoute: ActivatedRouteStub;
  let domainServiceStub: jasmine.SpyObj<DomainService>;
  let matDialogStub: jasmine.SpyObj<MatDialog>;
  let afterClosed$: Subject<void>;
  let isReservedValue = false;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getItem',
        'getReservationFlag',
        'setReservationFlag',
      ]
    );
    const matDialog = jasmine.createSpyObj(
      'MatDialog',
      [
        'open'
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
        ItemViewComponent,
      ],
      imports: [
        CustomMaterialModule,
        NoopAnimationsModule,
        TestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DomainService, useValue: domainService },
        { provide: MatDialog, useValue: matDialog },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
    matDialogStub = TestBed.get(MatDialog);
    const iconRegistry: MatIconRegistry = TestBed.get(MatIconRegistry);
    const sanitizer: DomSanitizer = TestBed.get(DomSanitizer);
    iconRegistry.addSvgIconLiteral('edit', sanitizer.bypassSecurityTrustHtml('<svg></svg>'));
  }));

  beforeEach(() => {
    afterClosed$ = new Subject<void>();
    matDialogStub.open.and.returnValue(
      {
        afterClosed: () => afterClosed$.asObservable()
      } as any
    );

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
    domainServiceStub.getReservationFlag.and.callFake((idparam) =>
      (idparam === id
        ? cold('--x|', { x: new Result(isReservedValue) })
        : cold('--#', new Error('Item not found')))
    );
    return { id, item };
  }

  function initItemView() {
    const viewData = prepareViewData();
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();
    return viewData;
  }

  function revealStatus() {
    fixture.debugElement.query(By.css('mat-card-actions button:nth-child(1)')).nativeElement.click();
    getTestScheduler().flush(); // flush the observables
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

  it('should refresh reservation status on click', () => {
    // Arrange
    const viewData = initItemView();
    const preClickCallCount = domainServiceStub.getReservationFlag.calls.count();

    // Act
    revealStatus();

    // Assert
    const postClickCallCount = domainServiceStub.getReservationFlag.calls.count();
    expect(preClickCallCount).toBe(0, 'Function should not be called prior to click');
    expect(postClickCallCount).toBe(1, 'Function should be called after click');
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
      isReservedValue = testRunData.isReservedValue;
      initItemView();
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

    [{
      testName: 'should open dialog on click to remove reservation',
      isReservedValue: true
    }, {
      testName: 'should open dialog on click to set reservation',
      isReservedValue: false
    }].forEach(testRunData2 => {
      it(testRunData2.testName, () => {
        // Arrange
        isReservedValue = testRunData2.isReservedValue;
        const viewData = initItemView();
        revealStatus();
        const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('mat-card-actions button')[1];

        // Act
        button.click();
        fixture.detectChanges();

        // Assert
        const dlgConfig: MatDialogConfig = {
          data: {
            item: viewData.item,
            isReserved: testRunData2.isReservedValue,
          }
        };
        expect(matDialogStub.open).toHaveBeenCalledTimes(1);
        expect(matDialogStub.open.calls.mostRecent().args).toEqual([EditReservationDialogComponent, dlgConfig]);
      });
    });
  });

  it('should refresh reservation status on dialog close event', () => {
    // Arrange
    const viewData = initItemView();
    revealStatus();
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('mat-card-actions button')[1];
    button.click();
    fixture.detectChanges();
    const preCloseCallCount = domainServiceStub.getReservationFlag.calls.count();

    // Act
    afterClosed$.next();
    afterClosed$.complete();

    // Assert
    expect(preCloseCallCount).toBe(1);
    const postCloseCallCount = domainServiceStub.getReservationFlag.calls.count();
    expect(postCloseCallCount).toBe(2);
  });

  it('should show 404 when item does not exist', () => {
    // Arrange
    domainServiceStub.getItem.and.returnValue(
      cold('--x|', { x: {} })
    );
    activatedRoute.setParamMap({ id: '99999' });
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
