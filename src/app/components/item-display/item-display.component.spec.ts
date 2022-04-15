import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EditReservationStubComponent } from 'testing/stubs/edit-reservation.stub.component';

import { ItemDisplayComponent } from './item-display.component';

describe('ItemDisplayComponent', () => {
  let component: ItemDisplayComponent;
  let fixture: ComponentFixture<ItemDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDisplayComponent, EditReservationStubComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
