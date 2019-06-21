import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles';

import { ItemEditComponent } from './item-edit.component';
import { ActivatedRouteStub, RouterLinkDirectiveStub, ActivatedRoute, TestRandom, ItemBuilder, TestAppLoaderComponent } from 'testing';
import { DomainService } from '../../domain.service';
import { Result } from '../../domain';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ItemEditComponent', () => {
  let component: ItemEditComponent;
  let fixture: ComponentFixture<ItemEditComponent>;
  let activatedRoute: ActivatedRouteStub;
  let domainServiceStub: jasmine.SpyObj<DomainService>;

  beforeEach(async(() => {
    const domainService = jasmine.createSpyObj(
      'DomainService',
      [
        'getItem'
      ]
    );
    initTestScheduler();
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [
        ItemEditComponent,
        TestAppLoaderComponent,
        RouterLinkDirectiveStub,
      ],
      imports: [
        NoopAnimationsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DomainService, useValue: domainService }
      ]
    })
      .compileComponents();
    domainServiceStub = TestBed.get(DomainService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    resetTestScheduler();
  });

  it('should create', () => {
    domainServiceStub.getItem.and.returnValue(
      cold('--x|', { x: new Result(null) })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  function prepareViewData() {
    const id = TestRandom.r(9000, 4000);
    const item = ItemBuilder.with().id(id).build();
    activatedRoute.setParamMap({ id });
    domainServiceStub.getItem.and.returnValue(
      cold('--x|', { x: new Result(item) })
    );
    return { id, item };
  }

  it('should get item by id', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    expect(domainServiceStub.getItem).toHaveBeenCalledWith(viewData.id);
  });

  it('should show title of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('input')[0] as HTMLInputElement).value).toBe(viewData.item.title);
  });

  it('should show description of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('textarea')[0] as HTMLTextAreaElement).value).toBe(viewData.item.description);
  });

  it('should show category of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('input')[1] as HTMLInputElement).value).toBe(viewData.item.category);
  });

  it('should show image url of item', () => {
    // Arrange
    const viewData = prepareViewData();

    // Act
    fixture.detectChanges();
    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    // Assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelectorAll('input')[2] as HTMLInputElement).value).toBe(viewData.item.imagesrc);
  });
});
