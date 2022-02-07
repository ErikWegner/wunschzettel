import { createAction, props } from '@ngrx/store';
import { WishlistItem } from '../business/item';

export const getItems = createAction('[W] Get items');

export const itemsLoaded = createAction(
  '[W] Items loaded',
  props<{
    items: WishlistItem[];
  }>()
);
