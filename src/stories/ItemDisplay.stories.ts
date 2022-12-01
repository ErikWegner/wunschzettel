import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ShowReservationStatusComponent } from 'src/app/components/show-reservation-status/show-reservation-status.component';
import { ItemDisplayComponent } from 'src/app/components/item-display/item-display.component';
import { AppState } from 'src/app/store/app.state';
import { AppStateBuilder, appStateStub } from 'testing/app.state.builder';
import { WishlistItemBuilder } from 'testing/item.builder';
import { defaultProviders, moduleImports } from './matmetadata';

const initialState: AppState = appStateStub();

export default {
  title: 'Item display',
  component: ItemDisplayComponent,
  decorators: [
    moduleMetadata({
      declarations: [ShowReservationStatusComponent],
      imports: moduleImports,
      providers: [provideMockStore({ initialState })],
    }),
  ],
} as Meta;

export const Display: Story = () => ({
  props: {
    item: WishlistItemBuilder.faust(),
  },
});

export const Reserved: Story = () => ({
  props: {
    item: WishlistItemBuilder.faust(),
  },
});
Reserved.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('reserved').withActiveItem(),
      }),
    ],
  }),
];

export const Free: Story = () => ({
  props: {
    item: WishlistItemBuilder.faust(),
  },
});
Free.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...defaultProviders,
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('free').withActiveItem(),
      }),
    ],
  }),
];
