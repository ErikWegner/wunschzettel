import { Meta, Story } from '@storybook/angular';
import { PageNotFoundComponent } from 'src/app/pages/page-not-found/page-not-found.component';
import { decorators } from './matmetadata';

export default {
  title: 'Page not found',
  component: PageNotFoundComponent,
  decorators,
} as Meta;

export const Display: Story = () => ({
  props: {},
});
