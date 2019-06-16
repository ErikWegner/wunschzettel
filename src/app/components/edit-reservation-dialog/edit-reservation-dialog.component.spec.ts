import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { EditReservationDialogComponent, EditReservationDialogData } from './edit-reservation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { ItemBuilder, TestRandom } from 'testing';
import { DomainService } from 'src/app/domain.service';
import { Result } from 'src/app/domain';
import { ReactiveFormsModule } from '@angular/forms';
import { CaptchaChallenge } from 'src/app/domain/captcha-challenge';

describe('EditReservationDialogComponent', () => {
  let component: EditReservationDialogComponent;
  let fixture: ComponentFixture<EditReservationDialogComponent>;
  let dialogData: EditReservationDialogData;
  let domainServiceStub: jasmine.SpyObj<DomainService>;
  let challengeText: string;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getCaptchaChallenge',
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
});
