import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageComponent } from './add-page.component';

@Component({
  selector: 'app-item-form',
  template: '<div>app-item-form</div>',
})
export class ItemFormStubComponent {
  constructor() {}
}

describe('AddPageComponent', () => {
  let component: AddPageComponent;
  let fixture: ComponentFixture<AddPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPageComponent, ItemFormStubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
