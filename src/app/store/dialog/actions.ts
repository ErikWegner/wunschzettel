import { createAction, props } from '@ngrx/store';

export const showReservationDialog = createAction(
  '[D] Show reservation dialog',
  props<{
    itemId: number;
  }>()
);
