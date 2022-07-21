import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatNavListHarness } from '@angular/material/list/testing';
import { RouterModule } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';

import { MenuNavlistComponent } from './menu-navlist.component';

describe('MenuNavlistComponent', () => {
  let component: MenuNavlistComponent;
  let fixture: ComponentFixture<MenuNavlistComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const initialState: AppState = appStateStub();
    await TestBed.configureTestingModule({
      declarations: [MenuNavlistComponent],
      imports: [MatDividerModule, MatListModule, RouterModule.forRoot([])],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNavlistComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create menu links', async () => {
    // Arrange
    const aboutItemCount = 1;
    const nextState = AppStateBuilder.someCategories();
    store.setState(nextState);
    fixture.detectChanges();
    const list = await loader.getHarness(MatNavListHarness);

    // Act
    const items = await list.getItems();

    // Assert
    const preLinks = [
      { name: 'categories link', text: 'Kategorien', href: '/kategorien' },
      { name: 'all items', text: 'Alle Einträge', href: '/wunschliste' },
    ];
    for (let index = 0; index < preLinks.length; index++) {
      const preLink = preLinks[index];
      const item = items.shift()!;
      const itemText = await item.getText();
      const itemLink = await item.getHref();
      expect(itemText)
        .withContext(`Element #${preLink.name} should show text`)
        .toBe(preLink.text);
      expect(itemLink)
        .withContext(`Element #${preLink.name} should link`)
        .toBe(preLink.href);
    }

    expect(items.length).toBe(
      nextState.wishlist.categories.length + aboutItemCount
    );
    await nextState.wishlist.categories.reduce(async (p, category, index) => {
      await p;
      const item = items[index];
      const itemText = await item.getText();
      const itemLink = await item.getHref();
      expect(itemText)
        .withContext(`Element #${index} should show category text`)
        .toBe(category);
      expect(itemLink)
        .withContext(`Element #${index} should link to category`)
        .toBe('/wunschliste/' + encodeURIComponent(category));
    }, Promise.resolve());
  });
});
