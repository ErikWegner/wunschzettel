import { Meta, Story } from '@storybook/angular';
import { title } from 'process';
import { ItemFormComponent } from 'src/app/components/item-form/item-form.component';
import { decorators } from './matmetadata';

export default {
  title: 'Item form',
  component: ItemFormComponent,
  decorators,
} as Meta;

const Template: Story<ItemFormComponent> = (args: ItemFormComponent) => ({
  props: args,
});

export const NewForm: Story = () => ({
  props: {},
});
NewForm.storyName = 'New form';
