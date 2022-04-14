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
