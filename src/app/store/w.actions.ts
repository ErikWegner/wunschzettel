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
