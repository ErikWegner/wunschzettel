import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { ItemPreviewStubComponent } from 'testing/stubs/item-preview.stub.component';

import { CategoryPageComponent } from './category-page.component';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [CategoryPageComponent, ItemPreviewStubComponent],
      imports: [MatCardModule, MatProgressSpinnerModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageComponent);
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
  });

  it('should display items', async () => {
    // Arrange
    const nextState = AppStateBuilder.withBookCategoryAndItems();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const pageDe: DebugElement = fixture.debugElement;
    const items = pageDe.queryAll(By.css('app-item-preview'));
    expect(items.length).toEqual(3);
  });
});
