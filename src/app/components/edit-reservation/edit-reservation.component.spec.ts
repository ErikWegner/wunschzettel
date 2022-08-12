import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
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
      imports: [MatIconModule, MatProgressSpinnerModule],
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

  it('should show hint on status unknown (which should never happen)', () => {
    // Arrange
    const nextState = AppStateBuilder.reservationStatus('unknown');
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const t = fixture.debugElement.nativeElement.textContent;
    expect(t).toBe('block Unbekannter Status ');
  });

  it('should show reserved status', () => {
    // Arrange
    const nextState = AppStateBuilder.reservationStatus('reserved');
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const t = fixture.debugElement.nativeElement.textContent;
    expect(t).toBe('warning_amber Es liegt bereits eine Reservierung vor. Reservierung löschen …');
  });

  it('should show free status', () => {
    // Arrange
    const nextState = AppStateBuilder.reservationStatus('free');
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const t = fixture.debugElement.nativeElement.textContent;
    expect(t).toBe('check_circle Es liegt keine Reservierung vor. Reservieren …');
  });

  it('should show error message', () => {
    // Arrange
    const nextState = AppStateBuilder.reservationStatus('updateFailed', {
      errorText: 'Kommunikationsfehler',
    });
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Assert
    const t = fixture.debugElement.nativeElement.textContent;
    expect(t).toBe(
      'heart_broken Da ist etwas schiefgelaufen.  Kommunikationsfehler '
    );
  });
});
