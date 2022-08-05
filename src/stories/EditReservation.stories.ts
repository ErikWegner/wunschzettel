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
HasReservation.storyName = 'Has reservation';
HasReservation.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('reserved'),
      }),
    ],
  }),
];

export const IsUnkown: Story = () => ({
  props: {},
});
IsUnkown.storyName = 'Is unknown';
IsUnkown.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('unknown'),
      }),
    ],
  }),
];

export const IsFree: Story = () => ({
  props: {},
});
IsFree.storyName = 'Is free';
IsFree.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('free'),
      }),
    ],
  }),
];

export const UpdateFailed: Story = () => ({
  props: {},
});
UpdateFailed.storyName = 'Update failed';
UpdateFailed.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('updateFailed', {
          errorText: 'Captcha-Fehler',
        }),
      }),
    ],
  }),
];
