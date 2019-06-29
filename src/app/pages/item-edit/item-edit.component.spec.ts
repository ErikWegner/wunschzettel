import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemEditComponent } from './item-edit.component';
import { ActivatedRouteStub, RouterLinkDirectiveStub, ActivatedRoute, TestRandom, ItemBuilder, TestAppLoaderComponent } from 'testing';
import { DomainService } from '../../domain.service';
import { Result, Item } from '../../domain';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CaptchaChallenge } from 'src/app/domain/captcha-challenge';
import { CaptchaState } from 'src/app/components/captcha-state';
import { By } from '@angular/platform-browser';

describe('ItemEditComponent', () => {
  let component: ItemEditComponent;
  let fixture: ComponentFixture<ItemEditComponent>;
  let activatedRoute: ActivatedRouteStub;
  let domainServiceStub: jasmine.SpyObj<DomainService>;
  let challengeText: string;
  let onClickState: CaptchaState;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getCaptchaChallenge',
        'getItem',
        'setItem',
      ]
    );
    challengeText = TestRandom.randomString(6, 'challenge-');
    initTestScheduler();
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [
        ItemEditComponent,
        TestAppLoaderComponent,
        RouterLinkDirectiveStub,
      ],
      imports: [
        NoopAnimationsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DomainService, useValue: domainService }
      ]
    })
      .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
    domainServiceStub.getCaptchaChallenge.and.returnValue(
      cold('--x|', { x: new Result(new CaptchaChallenge(challengeText)) })
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    resetTestScheduler();
  });

  function setFormItemValue(text: string, index: number, htmlType = 'input') {
    const input: HTMLInputElement = fixture.nativeElement.querySelectorAll(htmlType)[index];
    if (!input) {
      fail(`Form item type ${htmlType}[${index}] not found for ${text}`);
      return;
    }
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  function setCaptchaResponse(text: string) {
    setFormItemValue(text, 4);
  }

  function setFormValues(item: Item) {
    component.description.setValue(item.description);
    setFormItemValue(item.title, 0);
    setFormItemValue(item.category, 1);
    setFormItemValue(item.imagesrc, 2);
    setFormItemValue(item.buyurl, 3);
  }

  function clickSubmitAndRespond(r: Result<string> | Error) {
    domainServiceStub.setItem.and.callFake((item) => {
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
    expect((compiled.querySelectorAll('input')[0] as HTMLInputElement).value).toBe(viewData.item.title);
  });

  it('should show description of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('textarea')[0] as HTMLTextAreaElement).value).toBe(viewData.item.description);
  });

  it('should show category of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('input')[1] as HTMLInputElement).value).toBe(viewData.item.category);
  });

  it('should show image url of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('input')[2] as HTMLInputElement).value).toBe(viewData.item.imagesrc);
  });

  it('should show shopping url of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('input')[3] as HTMLInputElement).value).toBe(viewData.item.buyurl);
  });

  it('should query captcha text', () => {
    // Arrange
    prepareViewData();
    const state1 = fixture.componentInstance.formState;

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelectorAll('label')[5].textContent).toContain(challengeText);
    expect(state1).toBe(fixture.componentInstance.formStateEnum.Loading);
    const state2 = fixture.componentInstance.formState;
    expect(state2).toBe(fixture.componentInstance.formStateEnum.WaitingForUserInput);
  });

  [
    {
      testname: 'everything ok',
      backendResponse: new Result('Success'),
      expectedFinalDlgState: CaptchaState.Success
    },
    {
      testname: 'backend refused',
      backendResponse: new Result('Captcha wrong', false),
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
      const viewData = prepareViewData();
      const captchaInput = TestRandom.randomString(8);
      fixture.detectChanges();
      getTestScheduler().flush(); // flush the observables
      getTestScheduler().flush(); // flush the observables
      fixture.detectChanges();
      const preSubmitState = fixture.componentInstance.formState;

      // Act
      const newItem = ItemBuilder.with().id(viewData.id).build();
      setFormValues(newItem);
      setCaptchaResponse(captchaInput);
      fixture.detectChanges();
      clickSubmitAndRespond(testRunData1.backendResponse);

      // Assert
      expect(domainServiceStub.setItem).toHaveBeenCalledTimes(1);
      const arg = domainServiceStub.setItem.calls.mostRecent().args[0];
      newItem.isReserved = arg.isReserved = false; // property is ignored
      expect(arg).toEqual(newItem);
      const postSubmitState = fixture.componentInstance.formState;
      expect(preSubmitState).toBe(CaptchaState.WaitingForUserInput, 'preSubmitState');
      expect(onClickState).toBe(CaptchaState.Submitting, 'onClickState');
      expect(postSubmitState).toBe(testRunData1.expectedFinalDlgState, 'postSubmitState');
    });
  });
});
