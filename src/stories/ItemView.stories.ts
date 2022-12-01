import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ItemDisplayComponent } from 'src/app/components/item-display/item-display.component';
import { ItemViewComponent } from 'src/app/pages/item-view/item-view.component';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

const initialState: AppState =
  AppStateBuilder.withBookCategoryAndItems().withActiveItem();

export default {
  title: 'Pages/Item',
  component: ItemViewComponent,
  decorators: [
    moduleMetadata({
      declarations: [ItemDisplayComponent],
      imports: moduleImports,
      providers: [provideMockStore({ initialState })],
    }),
  ],
} as Meta;

const Template: Story<ItemViewComponent> = (args: ItemViewComponent) => ({
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

export const Display: Story = () => ({});
