import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CategoriesPageComponent } from 'src/app/pages/categories-page/categories-page.component';
import { AppState } from 'src/app/store/app.state';
import { appStateStub, AppStateBuilder } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

const initialState: AppState = appStateStub();

export default {
  title: 'Pages/Categories',
  component: CategoriesPageComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
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
