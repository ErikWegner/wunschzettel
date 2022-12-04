import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NEVER, of } from 'rxjs';
import { Result } from 'src/app/business/result';
import { DialogData } from 'src/app/components/update-reservation-dialog/dialog-data';
import { UpdateReservationDialogComponent } from 'src/app/components/update-reservation-dialog/update-reservation-dialog.component';
import { ItemsService } from 'src/app/services/items.service';
import { AppStateBuilder } from 'testing/app.state.builder';
import { decorators, defaultProviders, moduleImports } from './matmetadata';

@Component({
  template: '',
})
class LaunchComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.dialog.open(UpdateReservationDialogComponent, {
      data: <DialogData>{
        itemId: 1,
        targetState: 'reserve',
      },
    });
  }
}

export default {
  title: 'Update reservation dialog',
  component: LaunchComponent,
  decorators,
} as Meta;

const customDefaultProviders = [
  ...defaultProviders,
  {
    provide: ItemsService,
    useValue: {
      getCaptchaChallenge: () => of(new Result('acht')),
    },
  },
];

const dialogData: DialogData = {
  itemId: 5,
  targetState: 'clear',
};

export const InitLoading: Story = () => ({
  props: {},
});
InitLoading.storyName = 'Initializing';
InitLoading.decorators = [
  moduleMetadata({
    declarations: [UpdateReservationDialogComponent],
    imports: moduleImports,
    providers: [
      ...customDefaultProviders,
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('requestPending'),
      }),
      {
        provide: ItemsService,
        useValue: {
          getCaptchaChallenge: () => NEVER,
        },
      },
    ],
  }),
];

export const LoadingUpdating: Story = () => ({
  props: {},
});
LoadingUpdating.storyName = 'Updating';
LoadingUpdating.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...customDefaultProviders,
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('requestPending'),
      }),
    ],
  }),
];

const hasReservationDialogData: DialogData = {
  ...dialogData,
  targetState: 'clear',
};
export const HasReservation: Story = () => ({
  props: {},
});
HasReservation.storyName = 'Has reservation';
HasReservation.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...customDefaultProviders,
      { provide: MAT_DIALOG_DATA, useValue: hasReservationDialogData },
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
      ...customDefaultProviders,
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('unknown'),
      }),
    ],
  }),
];

const isFreeDialogData: DialogData = {
  ...dialogData,
  targetState: 'reserve',
};
export const IsFree: Story = () => ({
  props: {},
});
IsFree.storyName = 'Is free';
IsFree.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      ...customDefaultProviders,
      { provide: MAT_DIALOG_DATA, useValue: isFreeDialogData },
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
      ...customDefaultProviders,
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
      provideMockStore({
        initialState: AppStateBuilder.reservationStatus('updateFailed', {
          errorText: 'Captcha-Fehler',
        }),
      }),
    ],
  }),
];
