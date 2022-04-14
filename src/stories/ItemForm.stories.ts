import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ItemFormComponent } from 'src/app/components/item-form/item-form.component';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { decorators, defaultProviders, moduleImports } from './matmetadata';

const initialState: AppState = appStateStub();

export default {
  title: 'Item form',
  component: ItemFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: moduleImports,
      providers: [...defaultProviders, provideMockStore({ initialState })],
    }),
  ],
} as Meta;

const Template: Story<ItemFormComponent> = (args: ItemFormComponent) => ({
  props: args,
});

export const NewForm: Story = () => ({
  props: {},
});
NewForm.storyName = 'New form';

export const EditForm: Story = () => ({
  props: {},
});
EditForm.storyName = 'Edit form (TODO)';

export const SaveError: Story = () => ({
  props: {},
});
SaveError.storyName = 'Save error (TODO)';

export const Saving: Story = () => ({
  props: {},
});
Saving.storyName = 'Saving (TODO)';
Saving.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({ initialState: AppStateBuilder.pendingRequest() }),
    ],
  }),
];
