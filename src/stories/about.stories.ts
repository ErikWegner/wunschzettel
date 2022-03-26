import { Meta, Story } from '@storybook/angular';
import { AboutComponent } from 'src/app/pages/about/about.component';
import { decorators } from './matmetadata';

export default {
  title: 'About element',
  component: AboutComponent,
  decorators,
} as Meta;

export const Display: Story = () => ({
  props: {},
});
