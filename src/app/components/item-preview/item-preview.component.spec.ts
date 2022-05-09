import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { INIT_ACTION } from '@ngrx/store-devtools/src/reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { AppState } from 'src/app/store/app.state';
import { goToItem } from 'src/app/store/w.actions';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { randomNumber } from 'testing/utils';

import { ItemPreviewComponent } from './item-preview.component';

describe('ItemPreviewComponent', () => {
  let component: ItemPreviewComponent;
  let fixture: ComponentFixture<ItemPreviewComponent>;
  let store: MockStore;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [ItemPreviewComponent],
      imports: [MatCardModule, MatDividerModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dispatch navigation on click', () => {
    // Arrange
    const nextState = AppStateBuilder.withBookCategoryAndItems();
    store.setState(nextState);
    const itemId = randomNumber(100, 20);
    component.item = WishlistItemBuilder.n().withId(itemId).build();
    fixture.detectChanges();
    const n = fixture.nativeElement as HTMLElement;
    const card = n.querySelector('mat-card');

    // Act
    card?.dispatchEvent(new Event('click'));

    // Assert
    const expected = cold('a', {
      a: goToItem({ itemId }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
