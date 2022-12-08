import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NEVER, of } from 'rxjs';
import { ItemsService } from 'src/app/services/items.service';
import { randomNumber, randomString } from 'testing/utils';
import { Result } from '../../business/result';
import { DialogData } from './dialog-data';

import { UpdateReservationDialogComponent } from './update-reservation-dialog.component';

describe('UpdateReservationDialogComponent', () => {
  let component: UpdateReservationDialogComponent;
  let fixture: ComponentFixture<UpdateReservationDialogComponent>;
  let loader: HarnessLoader;
  let dialogData: DialogData;
  let itemsService: jasmine.SpyObj<ItemsService>;

  beforeEach(async () => {
    dialogData = {
      itemId: randomNumber(900, 100),
      targetState: 'clear',
    };

    const serviceMock = jasmine.createSpyObj('ItemsService', [
      'getCaptchaChallenge',
      'setReservationFlag',
    ]);

    await TestBed.configureTestingModule({
      declarations: [UpdateReservationDialogComponent],
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ItemsService, useValue: serviceMock },
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateReservationDialogComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
    itemsService.getCaptchaChallenge.and.returnValue(NEVER);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  [
    {
      targetState: 'clear',
      title: 'Reservierung löschen',
      buttonText: 'Löschen',
    },
    {
      targetState: 'reserve',
      title: 'Reservieren',
      buttonText: 'Reservieren',
    },
  ].forEach((testsetup) => {
    it(`should set title on init for ${testsetup.targetState}`, async () => {
      // Arrange
      dialogData.targetState = testsetup.targetState as 'clear' | 'reserve';

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.title).toBe(testsetup.title);
      const control = (await loader.getAllHarnesses(MatButtonHarness))[2];
      const buttonText = await control.getText();
      expect(buttonText).toBe(testsetup.buttonText);
    });
  });

  describe('init', () => {
    it('should display captcha challenge on init', async () => {
      // Arrange
      const challenge = randomString(8, 'captcha:');
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValue(
        of(new Result(challenge))
      );

      // Act
      fixture.detectChanges();

      // Assert
      const control = (await loader.getAllHarnesses(MatFormFieldHarness))[0];
      const label = await control.getLabel();
      expect(label).toBe(challenge);
    });

    it('should set pending request indicator in OnInit', () => {
      // Arrange
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValue(NEVER);

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.componentInstance.requestPending).toBeTrue();
    });

    it('should hide requestPending on init', async () => {
      // Arrange
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValue(of(new Result('0')));

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.componentInstance.requestPending).toBeFalse();
    });
  });

  describe('refresh', () => {
    const clickNeueAufgabe = async () => {
      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      for (let index = 0; index < buttons.length; index++) {
        const button = buttons[index];
        const label = await button.getText();
        if (label.includes('Neue Aufgabe')) {
          await button.click();
        }
      }

      fixture.detectChanges();
    };

    it('should refresh captcha', async () => {
      // Arrange
      const challenge1 = randomString(8, 'captcha 1:');
      const challenge2 = randomString(8, 'captcha 2:');
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValues(
        of(new Result(challenge1)),
        of(new Result(challenge2))
      );
      fixture.detectChanges();

      // Act
      await clickNeueAufgabe();

      // Assert
      const control = (await loader.getAllHarnesses(MatFormFieldHarness))[0];
      const label = await control.getLabel();
      expect(label).toBe(challenge2);
    });

    it('should set pending request indicator on refresh action', async () => {
      // Arrange
      const challenge1 = randomString(8, 'captcha 1:');
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValues(
        of(new Result(challenge1)),
        NEVER
      );
      fixture.detectChanges();

      // Act
      await clickNeueAufgabe();

      // Assert
      expect(fixture.componentInstance.requestPending).toBeTrue();
    });

    it('should clear pending request indicator after refresh action', async () => {
      // Arrange
      const challenge1 = randomString(8, 'captcha 1:');
      const challenge2 = randomString(8, 'captcha 2:');
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValues(
        of(new Result(challenge1)),
        of(new Result(challenge2))
      );
      fixture.detectChanges();

      // Act
      await clickNeueAufgabe();

      // Assert
      expect(fixture.componentInstance.requestPending).toBeFalse();
    });
  });

  describe('action', () => {
    const fillCaptcha = async (text: string) => {
      const field = await loader.getHarness(
        MatInputHarness.with({ placeholder: 'Zahl' })
      );
      await field.setValue(text);
    };
    const clickSubmit = async (text: 'Reservieren' | 'Löschen') => {
      const button = await loader.getHarness(MatButtonHarness.with({ text }));
      await button.click();
    };

    it('should update reservation through service', async () => {
      // Arrange
      itemsService.getCaptchaChallenge.calls.reset();
      itemsService.getCaptchaChallenge.and.returnValues(
        of(new Result(randomString(2)))
      );
      const itemId = randomNumber(1000, 200);
      const captchaText = randomString(2);
      dialogData.targetState = 'reserve';
      dialogData.itemId = itemId;
      fixture.detectChanges();
      await fillCaptcha(captchaText);

      // Act
      await clickSubmit('Reservieren');

      // Assert
      expect(itemsService.setReservationFlag).toHaveBeenCalledOnceWith(
        itemId,
        true,
        captchaText
      );
    });
  });
});
