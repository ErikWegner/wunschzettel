import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemDeleteComponent } from './item-delete.component';
import { ActivatedRouteStub, ActivatedRoute, ItemBuilder, TestRandom } from 'testing';
import { DomainService } from '../../domain.service';
import { Result, CaptchaResponse } from '../../domain';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CaptchaChallenge } from 'src/app/domain/captcha-challenge';
import { CaptchaState } from 'src/app/components/captcha-state';
import { By } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';
import { TestingModule } from 'src/app/testing.module';

describe('ItemDeleteComponent', () => {
  let component: ItemDeleteComponent;
  let fixture: ComponentFixture<ItemDeleteComponent>;
  let activatedRoute: ActivatedRouteStub;
  let domainServiceStub: jasmine.SpyObj<DomainService>;
  let challengeText: string;
  let onClickState: CaptchaState;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'deteleItem',
        'getCaptchaChallenge',
        'getItem',
      ]
    );
    const routerSpy = jasmine.createSpyObj(
      'Router',
      [
        'navigate'
      ]
    );
    challengeText = TestRandom.randomString(6, 'challenge-');
    initTestScheduler();
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [
        ItemDeleteComponent,
      ],
      imports: [
        NoopAnimationsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
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
    domainServiceStub.getCaptchaChallenge.and.returnValue(
      cold('--x|', { x: new Result(new CaptchaChallenge(challengeText)) })
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDeleteComponent);
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

  function createComponent() {
    const viewData = prepareViewData();
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();
    return viewData;
  }

  function setCaptchaResponse(text: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[0];
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  function clickSubmitAndRespond(r: Result<string> | Error) {
    domainServiceStub.deteleItem.and.callFake((id, c) => {
      onClickState = fixture.componentInstance.formState;
      if (r instanceof Error) {
        return cold('#', r);
      }
      return cold('--r|', { r });
    });
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

  it('should query captcha text', () => {
    // Arrange
    const state1 = fixture.componentInstance.formState;
    createComponent();

    // Act
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelectorAll('label')[0].textContent).toContain(challengeText);
    expect(state1).toBe(fixture.componentInstance.formStateEnum.Loading, 'state1');
    const state2 = fixture.componentInstance.formState;
    expect(state2).toBe(fixture.componentInstance.formStateEnum.WaitingForUserInput, 'state2');
  });

  [
    {
      testname: 'everything ok',
      backendResponse: new Result('Success'),
      expectedFinalDlgState: CaptchaState.Success
    },
    {
      testname: 'backend refused',
      backendResponse: new Result('Reservation state mismatch', false),
      expectedFinalDlgState: CaptchaState.Error
    },
    {
      testname: 'transmission failed',
      backendResponse: new Error('Connection timeout'),
      expectedFinalDlgState: CaptchaState.Fail
    }
  ].forEach(testRunData1 => {
    it('should send request: ' + testRunData1.testname, () => {
      // Arrange
      const captchaInput = TestRandom.randomString(8);
      const viewData = createComponent();
      getTestScheduler().flush(); // flush the observables
      fixture.detectChanges();
      const preSubmitState = fixture.componentInstance.formState;

      // Act
      setCaptchaResponse(captchaInput);
      fixture.detectChanges();
      clickSubmitAndRespond(testRunData1.backendResponse);

      // Assert
      expect(domainServiceStub.deteleItem).toHaveBeenCalledWith(
        viewData.id, new CaptchaResponse(captchaInput));
      const postSubmitState = fixture.componentInstance.formState;
      expect(preSubmitState).toBe(CaptchaState.WaitingForUserInput);
      expect(onClickState).toBe(CaptchaState.Submitting);
      expect(postSubmitState).toBe(testRunData1.expectedFinalDlgState);
    });
  });

  it('should show a button to try again on error', () => {
    // Arrange
    const captchaInput = TestRandom.randomString(8);
    createComponent();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();
    const challenge1 = fixture.nativeElement.querySelectorAll('label')[0].textContent;
    setCaptchaResponse(captchaInput);
    fixture.detectChanges();
    clickSubmitAndRespond(new Result('Captcha wrong', false));
    challengeText = TestRandom.randomString(8);
    domainServiceStub.getCaptchaChallenge.and.returnValue(
      cold('--x|', { x: new Result(new CaptchaChallenge(challengeText)) })
    );

    // Act
    fixture.debugElement.query(By.css('mat-card-content button')).nativeElement.click();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const challenge2 = fixture.nativeElement.querySelectorAll('label')[0].textContent as string;
    const postSubmitState = fixture.componentInstance.formState;
    expect(postSubmitState).toBe(CaptchaState.WaitingForUserInput);
    expect(challenge1).not.toBe(challenge2);
    expect(challenge2.trim()).toBe(challengeText + ' *');
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
