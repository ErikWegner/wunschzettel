import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import {
  MatListHarness,
  MatListItemHarness,
} from '@angular/material/list/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { appStateStub } from 'testing/app.state.builder';
import { ListBuilder } from 'testing/list-builder';
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
      declarations: [CategoriesPageComponent],
      imports: [MatListModule],
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
    const list = await loader.getAllHarnesses(MatListHarness);
    expect(list.length).toEqual(1);
    const items = await loader.getAllHarnesses(MatListItemHarness);
    expect(items.length).toEqual(count);
    expect(await items[1].getText()).toEqual('Category 1');
  });
});
