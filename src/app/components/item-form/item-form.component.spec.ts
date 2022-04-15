import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ConnectFormDirective } from 'src/app/directives/connect-form.directive';
import { FormEnabledDirective } from 'src/app/directives/form-enabled.directive';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';

import { ItemFormComponent } from './item-form.component';

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
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
});
