import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ItemFormComponent } from 'src/app/components/item-form/item-form.component';
import { ConnectFormDirective } from 'src/app/directives/connect-form.directive';
import { FormEnabledDirective } from 'src/app/directives/form-enabled.directive';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { defaultProviders, moduleImports } from './matmetadata';

const initialState: AppState = appStateStub();

const declarations = [ConnectFormDirective, FormEnabledDirective];

export default {
  title: 'Item form',
  component: ItemFormComponent,
  decorators: [
    moduleMetadata({
      declarations,
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
EditForm.storyName = 'Edit form';
EditForm.decorators = [
  moduleMetadata({
    declarations,
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({ initialState: AppStateBuilder.hasActiveItem() }),
    ],
  }),
];

export const SaveError: Story = () => ({
  props: {},
});
SaveError.storyName = 'Save error (TODO)';

export const Saving: Story = () => ({
  props: {},
});
Saving.decorators = [
  moduleMetadata({
    declarations,
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({ initialState: AppStateBuilder.pendingRequest() }),
    ],
  }),
];
