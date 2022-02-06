import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { WishlistState } from './w.state';

export const selectFeature = (state: any) => (state as AppState).wishlist;

export const selectCategories = createSelector(
  selectFeature,
  (state: WishlistState) => state.categories
);
