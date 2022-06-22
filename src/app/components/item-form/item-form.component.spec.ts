import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { ConnectFormDirective } from 'src/app/directives/connect-form.directive';
import { FormEnabledDirective } from 'src/app/directives/form-enabled.directive';
import { AppState } from 'src/app/store/app.state';
import { saveItem } from 'src/app/store/w.actions';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';

import { ItemFormComponent } from './item-form.component';

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
  let loader: HarnessLoader;
  let store: MockStore;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [
        ItemFormComponent,
        ConnectFormDirective,
        FormEnabledDirective,
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable form inputs', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const el: HTMLElement = fixture.nativeElement;
    const fieldset = el.querySelector('input')!;
    expect(fieldset.disabled)
      .withContext('itemForm must be enabled')
      .toBeFalse();
  });

  it('should disable form inputs while request is pending', () => {
    // Arrange
    const nextState = AppStateBuilder.pendingRequest();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input')!;
    expect(input.disabled)
      .withContext('input in itemForm must be disabled')
      .toBeTrue();
  });

  it('should show title when editing an item', () => {
    // Arrange
    const title = randomString(20, 'item title ');
    const nextState = AppStateBuilder.hasActiveItem({ Title: title });
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.itemForm.get('title')?.value).toBe(title);
  });

  it('should show description when editing an item', () => {
    // Arrange
    const descriptionText = randomString(20, 'Description text ');
    const nextState = AppStateBuilder.hasActiveItem({
      Description: descriptionText,
    });
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.itemForm.get('description')?.value).toBe(
      descriptionText
    );
  });

  it('should show category when editing an item', () => {
    // Arrange
    const category = randomString(20, 'Category ');
    const nextState = AppStateBuilder.hasActiveItem({
      Category: category,
    });
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.itemForm.get('category')?.value).toBe(
      category
    );
  });

  it('should show image url when editing an item', () => {
    // Arrange
    const imgurl = randomString(20, 'Image at ');
    const nextState = AppStateBuilder.hasActiveItem({
      ImgageUrl: imgurl,
    });
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.itemForm.get('imagesrc')?.value).toBe(
      imgurl
    );
  });

  it('should show shop url when editing an item', () => {
    // Arrange
    const shopurl = randomString(20, 'Shopping at ');
    const nextState = AppStateBuilder.hasActiveItem({
      BuyUrl: shopurl,
    });
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.itemForm.get('buyurl')?.value).toBe(
      shopurl
    );
  });

  it('should show captcha request text', () => {
    // Arrange
    const challenge = randomString(20, 'Your captcha challenge: ');
    const nextState = AppStateBuilder.hasActiveItem().withCaptcha(challenge);
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const el: HTMLElement = fixture.nativeElement;
    const labels = el.querySelectorAll('mat-label');
    expect(labels.length).withContext('There should be six labels').toBe(6);
    expect(labels[5].textContent).toBe(challenge);
  });

  it('should dispatch save action', async () => {
    // Arrange
    const challenge = randomString(20, 'Your captcha challenge: ');
    const nextState = AppStateBuilder.hasActiveItem().withCaptcha(challenge);
    store.setState(nextState);
    fixture.detectChanges();
    component.itemForm.patchValue({ captchaResponse: challenge });
    fixture.detectChanges();

    const button = await loader.getHarness(
      MatButtonHarness.with({ text: 'Speichern' })
    );

    // Act
    await button.click();

    // Assert
    const expected = cold('a', {
      a: saveItem({ item: nextState.wishlist.activeItem! }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
