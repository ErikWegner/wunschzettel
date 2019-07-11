import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { EditReservationDialogComponent, EditReservationDialogData } from './edit-reservation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { ItemBuilder, TestRandom } from 'testing';
import { DomainService } from 'src/app/domain.service';
import { Result, CaptchaResponse } from 'src/app/domain';
import { ReactiveFormsModule } from '@angular/forms';
import { CaptchaState } from '../captcha-state';
import { CaptchaChallenge } from 'src/app/domain/captcha-challenge';
import { By } from '@angular/platform-browser';
import { CaptchaChallengeBuilder } from 'testing/captcha-challenge-builder';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditReservationDialogComponent', () => {
  let component: EditReservationDialogComponent;
  let fixture: ComponentFixture<EditReservationDialogComponent>;
  let dialogData: EditReservationDialogData;
  let domainServiceStub: jasmine.SpyObj<DomainService>;
  let challenge: CaptchaChallenge;
  let onClickState: CaptchaState;

  beforeEach(async(() => {
    onClickState = null;
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getCaptchaChallenge',
        'setReservationFlag',
      ]
    );
    dialogData = {
      item: ItemBuilder.default(),
      isReserved: false,
    };
    challenge = CaptchaChallengeBuilder.default();
    initTestScheduler();
    TestBed.configureTestingModule({
      declarations: [EditReservationDialogComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        CustomMaterialModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { updateSize: jasmine.createSpy() } },
        { provide: DomainService, useValue: domainService },
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData }
      ]
    })
      .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
    domainServiceStub.getCaptchaChallenge.and.returnValue(
      cold('--x|', { x: new Result(challenge) })
    );
  }));

  afterEach(() => {
    resetTestScheduler();
  });

  function createComponent() {
    fixture = TestBed.createComponent(EditReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function setCaptchaResponse(text: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[0];
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  function clickSubmitAndRespond(r: Result<string> | Error) {
    domainServiceStub.setReservationFlag.and.callFake((id, f, c) => {
      onClickState = fixture.componentInstance.dlgState;
      if (r instanceof Error) {
        return cold('#', r);
      }
      return cold('--r|', { r });
    });
    fixture.debugElement.query(By.css('.mat-dialog-actions button:nth-child(1)')).nativeElement.click();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  [{
    isReservedValue: true,
    titleText: 'Reservierung löschen?',
  }, {
    isReservedValue: false,
    titleText: 'Reservieren?',
  }].forEach(testRunData => {
    it('should show title when reserved is ' + testRunData.isReservedValue, () => {
      // Arrange
      const item = ItemBuilder.default();
      dialogData = { item, isReserved: testRunData.isReservedValue };

      // Act
      createComponent();

      // Assert
      expect(fixture.nativeElement.querySelector('h1').textContent).toBe(testRunData.titleText);
    });
  });

  it('should query captcha text', () => {
    // Arrange
    createComponent();
    const state1 = fixture.componentInstance.dlgState;

    // Act
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelectorAll('label')[0].textContent).toBe(challenge.text);
    expect(fixture.nativeElement.querySelectorAll('mat-hint')[0].textContent).toBe(challenge.hint);
    expect(state1).toBe(fixture.componentInstance.dlgStateEnum.Loading);
    const state2 = fixture.componentInstance.dlgState;
    expect(state2).toBe(fixture.componentInstance.dlgStateEnum.WaitingForUserInput);
  });

  [true, false].forEach(isReserved => {
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
        dialogData.isReserved = isReserved;
        const captchaInput = TestRandom.randomString(8);
        createComponent();
        getTestScheduler().flush(); // flush the observables
        fixture.detectChanges();
        const preSubmitState = fixture.componentInstance.dlgState;

        // Act
        setCaptchaResponse(captchaInput);
        fixture.detectChanges();
        clickSubmitAndRespond(testRunData1.backendResponse);

        // Assert
        expect(domainServiceStub.setReservationFlag).toHaveBeenCalledWith(
          dialogData.item.id, !isReserved, new CaptchaResponse(captchaInput));
        const postSubmitState = fixture.componentInstance.dlgState;
        expect(preSubmitState).toBe(CaptchaState.WaitingForUserInput);
        expect(onClickState).toBe(CaptchaState.Submitting);
        expect(postSubmitState).toBe(testRunData1.expectedFinalDlgState);
      });
    });

    it('should show a button to try again on error', () => {
      // Arrange
      dialogData.isReserved = isReserved;
      const captchaInput = TestRandom.randomString(8);
      createComponent();
      getTestScheduler().flush(); // flush the observables
      fixture.detectChanges();
      const challenge1 = fixture.nativeElement.querySelectorAll('label')[0].textContent;
      setCaptchaResponse(captchaInput);
      fixture.detectChanges();
      clickSubmitAndRespond(new Result('Captcha wrong', false));
      challenge = CaptchaChallengeBuilder.with().text('New reservation challenge').build();
      domainServiceStub.getCaptchaChallenge.and.returnValue(
        cold('--x|', { x: new Result(challenge) })
      );

      // Act
      fixture.debugElement.query(By.css('.mat-dialog-content button')).nativeElement.click();
      getTestScheduler().flush(); // flush the observables
      fixture.detectChanges();

      // Assert
      const challenge2 = fixture.nativeElement.querySelectorAll('label')[0].textContent as string;
      const postSubmitState = fixture.componentInstance.dlgState;
      expect(postSubmitState).toBe(CaptchaState.WaitingForUserInput);
      expect(challenge1).not.toBe(challenge2);
      expect(challenge2.trim()).toBe(challenge.text);
    });
  });
});
