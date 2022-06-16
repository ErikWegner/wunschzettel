import { Action, createAction, props } from '@ngrx/store';
import { WishlistItem } from '../business/item';

export const getItems = createAction('[W] Get items', props);

export const itemsLoaded = createAction(
  '[W] Items loaded',
  props<{
    items: WishlistItem[];
  }>()
);

export const requestFailure = createAction(
  '[W] Request requestFailure',
  props<{
    errorText: string;
    errorDetails?: string;
    retryAction?: Action;
  }>()
);

export const goToCategory = createAction(
  '[W] Go to category',
  props<{
    category: string;
  }>()
);

export const goToItem = createAction(
  '[W] Go to item',
  props<{
    itemId: number;
  }>()
);
