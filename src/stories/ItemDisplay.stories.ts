import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { EditReservationComponent } from 'src/app/components/edit-reservation/edit-reservation.component';
import { ItemDisplayComponent } from 'src/app/components/item-display/item-display.component';
import { AppState } from 'src/app/store/app.state';
import { appStateStub } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

const initialState: AppState = appStateStub();

export default {
  title: 'Item display',
  component: ItemDisplayComponent,
  decorators: [
    moduleMetadata({
      declarations: [EditReservationComponent],
      imports: moduleImports,
      providers: [provideMockStore({ initialState })],
    }),
  ],
} as Meta;

export const Display: Story = () => ({
  props: {},
});
