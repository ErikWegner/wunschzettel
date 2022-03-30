import { Meta, Story } from '@storybook/angular';
import { ItemDisplayComponent } from 'src/app/components/item-display/item-display.component';
import { decorators } from './matmetadata';

export default {
  title: 'Item display',
  component: ItemDisplayComponent,
  decorators,
} as Meta;

export const Display: Story = () => ({
  props: {},
});
