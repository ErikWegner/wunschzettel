import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { ItemDisplayStubComponent } from 'testing/stubs/item-display.stub.component';

import { ItemViewComponent } from './item-view.component';

describe('ItemViewComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [ItemViewComponent, ItemDisplayStubComponent],
      imports: [MatProgressSpinnerModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display spinner while request is pending', async () => {
    // Arrange
    const nextState = AppStateBuilder.pendingRequest();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const pageDe: DebugElement = fixture.debugElement;
    const spinner = pageDe.query(By.css('mat-spinner'));
    expect(spinner).withContext('Spinner element').not.toBeNull();
    expect(pageDe.query(By.directive(ItemDisplayStubComponent)))
      .withContext('should not display component ItemDisplayStubComponent')
      .toBeNull();
  });

  const match = (
    fieldNameForContext: string,
    cssSelector: string,
    value: string
  ): void => {
    const pageDe: DebugElement = fixture.debugElement;
    const nelem = pageDe.query(By.css(cssSelector));
    expect(nelem)
      .withContext(`Field ${fieldNameForContext}: no element found`)
      .not.toBeNull();

    if (nelem) {
      const helem = nelem.nativeElement as HTMLElement;
      expect(helem.textContent)
        .withContext(`Field ${fieldNameForContext}`)
        .toBe(value);
    }
  };

  it('should display item', () => {
    // Arrange
    const item = WishlistItemBuilder.default();
    const nextState =
      AppStateBuilder.withBookCategoryAndItems().withActiveItem(item);
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    match('Title', '.title', item.Title);
    match('Category', '.category', item.Category);
  });
});
