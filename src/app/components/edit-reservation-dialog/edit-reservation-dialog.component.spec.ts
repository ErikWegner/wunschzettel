import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { EditReservationDialogComponent, EditReservationDialogData, DlgState } from './edit-reservation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { ItemBuilder, TestRandom } from 'testing';
import { DomainService } from 'src/app/domain.service';
import { Result } from 'src/app/domain';
import { ReactiveFormsModule } from '@angular/forms';
import { CaptchaChallenge } from 'src/app/domain/captcha-challenge';
import { By } from '@angular/platform-browser';

describe('EditReservationDialogComponent', () => {
  let component: EditReservationDialogComponent;
  let fixture: ComponentFixture<EditReservationDialogComponent>;
  let dialogData: EditReservationDialogData;
  let domainServiceStub: jasmine.SpyObj<DomainService>;
  let challengeText: string;
  let onClickState: DlgState;

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
      item: ItemBuilder.default()
    };
    challengeText = TestRandom.randomString(6, 'challenge-');
    initTestScheduler();
    TestBed.configureTestingModule({
      declarations: [EditReservationDialogComponent],
      imports: [
        ReactiveFormsModule,
        CustomMaterialModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: null },
        { provide: DomainService, useValue: domainService },
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData }
      ]
    })
      .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
    domainServiceStub.getCaptchaChallenge.and.returnValue(
      cold('--x|', { x: new Result(new CaptchaChallenge(challengeText)) })
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

  function clickSubmitAndRespond(r: Result<string>|Error) {
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
      const item = ItemBuilder.with().reservedStatus(testRunData.isReservedValue).build();
      dialogData = { item };

      // Act
      createComponent();

      // Assert
      expect(fixture.nativeElement.querySelector('h1').textContent).toBe(testRunData.titleText);
    });
  });

  it('should query captcha text', () => {
    // Arrange
    createComponent();

    // Act
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelectorAll('label')[0].textContent).toContain(challengeText);
  });

  [true, false].forEach(isReserved => {
    [
      {
        testname: 'everything ok',
        backendResponse: new Result('Success'),
        expectedFinalDlgState: DlgState.Success
      },
      {
        testname: 'backend refused',
        backendResponse: new Result('Reservation state mismatch', false),
        expectedFinalDlgState: DlgState.Error
      },
      {
        testname: 'transmission failed',
        backendResponse: new Error('Connection timeout'),
        expectedFinalDlgState: DlgState.Fail
      }
    ].forEach(testRunData1 => {
      it('should send request: ' + testRunData1.testname, () => {
        // Arrange
        dialogData.item.isReserved = isReserved;
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
          dialogData.item.id, !isReserved, captchaInput);
        const postSubmitState = fixture.componentInstance.dlgState;
        expect(preSubmitState).toBe(DlgState.Captcha);
        expect(onClickState).toBe(DlgState.Submitting);
        expect(postSubmitState).toBe(testRunData1.expectedFinalDlgState);
      });
    });
  });
});
