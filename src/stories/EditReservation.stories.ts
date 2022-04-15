import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { EditReservationComponent } from 'src/app/components/edit-reservation/edit-reservation.component';
import { AppStateBuilder } from 'testing/app.state.builder';
import { decorators, defaultProviders, moduleImports } from './matmetadata';

export default {
  title: 'Edit reservation',
  component: EditReservationComponent,
  decorators,
} as Meta;

export const LoadingUpdating: Story = () => ({
  props: {},
});
LoadingUpdating.storyName = 'Loading/updating';
LoadingUpdating.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('requestPending'),
      }),
    ],
  }),
];

export const HasReservation: Story = () => ({
  props: {},
});
HasReservation.storyName = 'Has reservation TODO';

export const IsFree: Story = () => ({
  props: {},
});
IsFree.storyName = 'Is free TODO';

export const UpdateFailed: Story = () => ({
  props: {},
});
UpdateFailed.storyName = 'Update failed TODO';
