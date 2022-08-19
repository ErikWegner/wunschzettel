import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
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
    ]);

    await TestBed.configureTestingModule({
      declarations: [UpdateReservationDialogComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
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
    itemsService.getCaptchaChallenge.and.returnValue(new Observable());
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
    { targetState: 'reserve', title: 'Reservieren', buttonText: 'Reservieren' },
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
  });

  it('should refresh captcha', async () => {
    // Arrange
    const challenge1 = randomString(8, 'captcha 1:');
    const challenge2 = randomString(8, 'captcha 2:');
    itemsService.getCaptchaChallenge.calls.reset();
    itemsService.getCaptchaChallenge.and.returnValues(
      of(new Result(challenge1)),
      of(new Result(challenge2))
    );

    const button = await loader.getHarness(
      MatButtonHarness.with({ text: 'Neue Aufgabe' })
    );
    fixture.detectChanges();

    // Act
    await button.click();

    // Assert
    const control = (await loader.getAllHarnesses(MatFormFieldHarness))[0];
    const label = await control.getLabel();
    expect(label).toBe(challenge2);
  });
});
