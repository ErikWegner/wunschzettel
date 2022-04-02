import { Meta, Story } from '@storybook/angular';
import { EditReservationDialogComponent } from 'src/app/components/edit-reservation-dialog/edit-reservation-dialog.component';
import { decorators } from './matmetadata';

export default {
  title: 'Edit reservation',
  component: EditReservationDialogComponent,
  decorators,
} as Meta;

export const Display: Story = () => ({
  props: {},
});
