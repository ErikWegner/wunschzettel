import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';

import { EditReservationComponent } from './edit-reservation.component';

describe('EditReservationComponent', () => {
  let component: EditReservationComponent;
  let fixture: ComponentFixture<EditReservationComponent>;
  let loader: HarnessLoader;
  let store: MockStore;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [EditReservationComponent],
      imports: [MatProgressSpinnerModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReservationComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner while request is pending', async () => {
    // Arrange
    const nextState = AppStateBuilder.reservationStatus('requestPending');
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const spinner = await loader.getHarness(MatProgressSpinnerHarness);
    expect(spinner).not.toBeNull();
  });

  xit('should show reserved status', () => {});
  xit('should show free status', () => {});
  xit('should show error message', () => {});
});
