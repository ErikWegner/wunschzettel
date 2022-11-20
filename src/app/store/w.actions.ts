import { createAction, props } from '@ngrx/store';
import { WishlistItem } from '../business/item';

export const getItems = createAction('[W] Get items', props);

export const itemsLoaded = createAction(
  '[W] Items loaded',
  props<{
    items: WishlistItem[];
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

export const goToItemFailed = createAction(
  '[W] Go to item failed',
  props<{
    itemId: number;
  }>()
);

export const setActiveItem = createAction(
  '[W] Set active item',
  props<{
    item?: WishlistItem;
  }>()
);

export const saveItem = createAction(
  '[W] Save item',
  props<{
    item: WishlistItem;
  }>()
);

export const setActiveItemAndShowReservationDialog = createAction(
  '[W] Show reservation dialog',
  props<{
    item?: WishlistItem;
  }>()
);
