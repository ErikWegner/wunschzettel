import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ItemFormComponent } from 'src/app/components/item-form/item-form.component';
import { AddPageComponent } from 'src/app/pages/add-page/add-page.component';
import { appStateStub } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

const initialState = appStateStub();

export default {
  title: 'Pages/Add',
  component: AddPageComponent,
  decorators: [
    moduleMetadata({
      declarations: [ItemFormComponent],
      imports: moduleImports,
      providers: [provideMockStore({ initialState })],
    }),
  ],
} as Meta;

const Template: Story<AddPageComponent> = (args: AddPageComponent) => ({
  props: args,
});

export const Empty = Template.bind({});
