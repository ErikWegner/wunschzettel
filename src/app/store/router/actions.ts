import { createAction, props } from '@ngrx/store';

export const navigatedToItem = createAction(
  '[R] navigatedToItem',
  props<{
    itemId: number;
  }>()
);
