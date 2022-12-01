import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { EmptyListComponent } from 'src/app/components/empty-list/empty-list.component';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { CategoriesPageComponent } from 'src/app/pages/categories-page/categories-page.component';
import { AppState } from 'src/app/store/app.state';
import { getItems } from 'src/app/store/w.actions';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

const initialState: AppState = appStateStub();

export default {
  title: 'Pages/Categories',
  component: CategoriesPageComponent,
  decorators: [
    moduleMetadata({
      declarations: [EmptyListComponent, ErrorDisplayComponent],
      imports: moduleImports,
      providers: [provideMockStore({ initialState })],
    }),
  ],
} as Meta;

const Template: Story<CategoriesPageComponent> = (
  args: CategoriesPageComponent
) => ({
  props: args,
});

export const Empty: Story = () => ({
  props: {},
});

export const Loading: Story = () => ({});
Loading.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      provideMockStore({ initialState: AppStateBuilder.pendingRequest() }),
    ],
  }),
];

export const Categories: Story = () => ({});
Categories.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      provideMockStore({ initialState: AppStateBuilder.someCategories() }),
    ],
  }),
];

export const Failure: Story = () => ({});
Failure.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      provideMockStore({
        initialState: AppStateBuilder.hasError(
          'Loading failed'
        ).withRetryAction(getItems()),
      }),
    ],
  }),
];