import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { clearFailedRequestAndRetry } from 'src/app/store/a.actions';
import { AppState } from 'src/app/store/app.state';
import { getItems } from 'src/app/store/w.actions';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { randomString } from 'testing/utils';

import { ErrorDisplayComponent } from './error-display.component';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;
  let loader: HarnessLoader;
  let store: MockStore;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [ErrorDisplayComponent],
      imports: [MatButtonModule, MatCardModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDisplayComponent);
    store = TestBed.inject(MockStore);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch retry action', async () => {
    // Arrange
    const errorText = randomString(20, 'Error');
    const failedAction = getItems();
    store.setState(
      AppStateBuilder.hasError(errorText).withRetryAction(failedAction)
    );
    fixture.detectChanges();
    const button = await loader.getHarness(MatButtonHarness);

    // Act
    await button.click();

    // Assert
    const expected = cold('a', {
      a: clearFailedRequestAndRetry({ action: failedAction }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
