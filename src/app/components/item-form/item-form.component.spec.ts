import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';

import { ItemFormComponent } from './item-form.component';

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
  let store: MockStore;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [ItemFormComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable form inputs', () => {
    // Act
    fixture.detectChanges();

    // Asset
    const el: HTMLElement = fixture.nativeElement;
    const fieldset = el.querySelector('fieldset')!;
    expect(fieldset.disabled)
      .withContext('itemForm must be enabled')
      .toBeFalse();
  });

  it('should disable form inputs while request is pending', () => {
    // Arrange
    const nextState = AppStateBuilder.pendingRequest();
    store.setState(nextState);

    // Act
    fixture.detectChanges();

    // Asset
    const el: HTMLElement = fixture.nativeElement;
    const fieldset = el.querySelector('fieldset')!;
    expect(fieldset.disabled)
      .withContext('itemForm must be disabled')
      .toBeTrue();
  });
});
