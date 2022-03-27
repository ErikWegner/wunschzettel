import { Meta, Story } from '@storybook/angular';
import { EmptyListComponent } from 'src/app/components/empty-list/empty-list.component';
import { decorators } from './matmetadata';

export default {
  title: 'Empty list',
  component: EmptyListComponent,
  decorators,
} as Meta;

export const Display: Story = () => ({
  props: {},
});
