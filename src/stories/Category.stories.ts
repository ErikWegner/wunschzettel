import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ItemPreviewComponent } from 'src/app/components/item-preview/item-preview.component';
import { CategoryPageComponent } from 'src/app/pages/category-page/category-page.component';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

const initialState: AppState = AppStateBuilder.withBookCategoryAndItems();

export default {
  title: 'Pages/Category',
  component: CategoryPageComponent,
  decorators: [
    moduleMetadata({
      declarations: [ItemPreviewComponent],
      imports: moduleImports,
      providers: [provideMockStore({ initialState })],
    }),
  ],
} as Meta;

const Template: Story<CategoryPageComponent> = (
  args: CategoryPageComponent
) => ({
  props: args,
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

export const Category: Story = () => ({});
