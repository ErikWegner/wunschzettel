import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WithCategoryPipe } from 'src/app/pipes/with-category.pipe';
import { AppState } from 'src/app/store/app.state';
import { ActivatedRouteStub } from 'testing/activated-route-stub';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { ItemPreviewStubComponent } from 'testing/stubs/item-preview.stub.component';
import { randomString } from 'testing/utils';
import { CategoryPageComponent } from './category-page.component';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let store: MockStore;
  let loader: HarnessLoader;
  let activatedRouteMock: ActivatedRouteStub;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    activatedRouteMock = new ActivatedRouteStub();
    await TestBed.configureTestingModule({
      declarations: [
        CategoryPageComponent,
        ItemPreviewStubComponent,
        WithCategoryPipe,
      ],
      imports: [MatCardModule, MatProgressSpinnerModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
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

  it('should filter displayed items by category', async () => {
    // Arrange
    const category = randomString(5, 'filter-category-');
    const nextState = AppStateBuilder.withBookCategoryAndItems()
      .withItem(WishlistItemBuilder.n().withCategory(category).build())
      .withItem(WishlistItemBuilder.n().withCategory(category).build());
    store.setState(nextState);

    activatedRouteMock.setParamMap({ category });

    // Act
    fixture.detectChanges();

    // Assert
    const pageDe: DebugElement = fixture.debugElement;
    const items = pageDe.queryAll(By.css('app-item-preview'));
    expect(items.length).toEqual(2);
  });
});
