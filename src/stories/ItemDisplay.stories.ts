import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { EditReservationComponent } from 'src/app/components/edit-reservation/edit-reservation.component';
import { ItemDisplayComponent } from 'src/app/components/item-display/item-display.component';
import { moduleImports } from './matmetadata';

export default {
  title: 'Item display',
  component: ItemDisplayComponent,
  decorators: [
    moduleMetadata({
      declarations: [EditReservationComponent],
      imports: moduleImports,
      providers: [],
    }),
  ],
} as Meta;

export const Display: Story = () => ({
  props: {},
});
