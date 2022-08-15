import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { WishlistItem } from 'src/app/business/item';
import { AppState } from 'src/app/store/app.state';
import { retrieveReservationStatus } from 'src/app/store/r.actions';
import { appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { ShowReservationStatusStubComponent } from 'testing/stubs/show-reservation-status.stub.component';

import { ItemDisplayComponent } from './item-display.component';

@Component({
  template: '<app-item-display [item]="item"></app-item-display>',
})
class TestHostComponent {
  item: WishlistItem | null = null;
}

describe('ItemDisplayComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [
        ItemDisplayComponent,
        ShowReservationStatusStubComponent,
        TestHostComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const getPanel = async () => {
    return await loader.getHarness(MatExpansionPanelHarness);
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close panel when item changes', async () => {
    // Arrange
    const panel = await getPanel();
    await panel.expand();
    const preState = await panel.isExpanded();

    // Act
    component.item = WishlistItemBuilder.default();
    fixture.detectChanges();

    // Assert
    const postState = await panel.isExpanded();
    expect(preState).withContext('Should be open').toBeTrue();
    expect(postState)
      .withContext('Should be closed when item changes')
      .toBeFalse();
  });

  it('should dispatch action to load reservation status when panel is opened', async () => {
    // Arrange
    const panel = await getPanel();
    const item = WishlistItemBuilder.default();
    component.item = item;
    fixture.detectChanges();

    // Act
    await panel.expand();

    // Assert
    const expected = cold('a', {
      a: retrieveReservationStatus({ itemId: item.id }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });

  [
    {
      testname: 'Show description after opening panel',
      isOpen: true,
      expectedDescription: 'Antippen zum Verstecken',
    },
    {
      testname: 'Show description after closing panel',
      isOpen: false,
      expectedDescription: 'Antippen zum Anzeigen',
    },
    {
      testname: 'Show description on init',
      isOpen: null,
      expectedDescription: 'Antippen zum Anzeigen',
    },
  ].forEach((testSetup) => {
    it(testSetup.testname, async () => {
      // Arrange
      const panel = await getPanel();
      const item = WishlistItemBuilder.default();
      component.item = item;
      fixture.detectChanges();

      // Act
      if (testSetup.isOpen !== null) {
        await panel.expand();
        await panel.collapse();
        await (testSetup.isOpen ? panel.expand() : panel.collapse());
      }

      // Assert
      const description = await panel.getDescription();
      expect(description).toBe(testSetup.expectedDescription);
    });
  });
});
