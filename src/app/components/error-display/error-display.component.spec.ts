import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { appStateStub } from 'testing/app.state.builder';

import { ErrorDisplayComponent } from './error-display.component';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [ErrorDisplayComponent],
      imports: [MatCardModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
