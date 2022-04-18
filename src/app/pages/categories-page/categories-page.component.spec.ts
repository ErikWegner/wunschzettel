import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { AppState } from 'src/app/store/app.state';
import { goToCategory } from 'src/app/store/w.actions';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { ListBuilder } from 'testing/list-builder';
import { EmptyListStubComponent } from 'testing/stubs/empty-list.stub.component';
import { randomNumber } from 'testing/utils';

import { CategoriesPageComponent } from './categories-page.component';

describe('CategoriesPageComponent', () => {
  let component: CategoriesPageComponent;
  let fixture: ComponentFixture<CategoriesPageComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent, EmptyListStubComponent],
      imports: [MatCardModule, MatProgressSpinnerModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPageComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const expectVisiblities = async (expecations: {
    wishlistItemsCount: number;
    emptyVisible: boolean;
    spinnerVisible: boolean;
  }): Promise<void> => {
    const items = await loader.getAllHarnesses(MatCardHarness);
    expect(items.length).toEqual(expecations.wishlistItemsCount);
    const pageDe: DebugElement = fixture.debugElement;

    const emptyCard = pageDe.query(By.css('app-empty-list'));
    const emptyCardExpect = expect(emptyCard).withContext('Empty card');
    if (expecations.emptyVisible) {
      emptyCardExpect.not.toBeNull();
    } else {
      emptyCardExpect.toBeNull();
    }

    const spinner = pageDe.query(By.css('mat-spinner'));
    const spinnerExpect = expect(spinner).withContext('Spinner element');
    if (expecations.spinnerVisible) {
      spinnerExpect.not.toBeNull();
    } else {
      spinnerExpect.toBeNull();
    }
  };

  it('should display spinner while request is pending', async () => {
    // Arrange
    const nextState = AppStateBuilder.pendingRequest();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    await expectVisiblities({
      wishlistItemsCount: 0,
      emptyVisible: false,
      spinnerVisible: true,
    });
  });

  it('should display categories', async () => {
    // Arrange
    const count = randomNumber(9, 3);
    const nextState = appStateStub();
    nextState.wishlist.categories = ListBuilder.with((i) => `Category ${i}`)
      .items(count)
      .build();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    await expectVisiblities({
      wishlistItemsCount: count,
      emptyVisible: false,
      spinnerVisible: false,
    });
    const items = await loader.getAllHarnesses(MatCardHarness);
    expect(items.length).toEqual(count);
    expect(await items[1].getText()).toEqual('Category 1');
  });

  it('should display empty message', async () => {
    // Arrange
    const nextState = appStateStub();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    await expectVisiblities({
      wishlistItemsCount: 0,
      emptyVisible: true,
      spinnerVisible: false,
    });
  });

  it('should dispatch navigate-to-category-request when clicking on category', async () => {
    // Arrange
    const nextState = AppStateBuilder.someCategories();
    store.setState(nextState);
    fixture.detectChanges();
    const secondCard = (await loader.getAllHarnesses(MatCardHarness))[1];

    // Act
    await (await secondCard.host()).click();

    // Assert
    const expected = cold('a', {
      a: goToCategory({ category: nextState.wishlist.categories[1] }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
