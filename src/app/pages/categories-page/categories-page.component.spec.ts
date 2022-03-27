import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCardHarness } from '@angular/material/card/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EmptyListComponent } from 'src/app/components/empty-list/empty-list.component';
import { AppState } from 'src/app/store/app.state';
import { appStateStub } from 'testing/app.state.builder';
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
      imports: [MatCardModule],
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
  }): Promise<void> => {
    const items = await loader.getAllHarnesses(MatCardHarness);
    expect(items.length).toEqual(expecations.wishlistItemsCount);
    const pageDe: DebugElement = fixture.debugElement;
    const emptyCard = pageDe.query(By.css('app-empty-list'));
    if (expecations.emptyVisible) {
      expect(emptyCard).not.toBeNull();
    } else {
      expect(emptyCard).toBeNull();
    }
  };

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
    await expectVisiblities({ wishlistItemsCount: count, emptyVisible: false });
    const items = await loader.getAllHarnesses(MatCardHarness);
    expect(items.length).toEqual(count);
    expect(await items[1].getText()).toEqual('Category 1');
  });

  it('should display empty message', async () => {
    const nextState = appStateStub();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    await expectVisiblities({ wishlistItemsCount: 0, emptyVisible: true });
  });
});
