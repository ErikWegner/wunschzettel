import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { WishlistState } from './w.state';

export const selectFeature = (state: any) => (state as AppState).wishlist;

export const selectCategories = createSelector(
  selectFeature,
  (state: WishlistState) => state.categories
);

export const selectItems = createSelector(
  selectFeature,
  (state: WishlistState) => state.items
);

export const selectActiveItemAsFormData = createSelector(
  selectFeature,
  (state: WishlistState) => ({
    title: state.activeItem?.Title,
    description: state.activeItem?.Description,
    category: state.activeItem?.Category,
    imagesrc: state.activeItem?.ImgageUrl,
    buyurl: state.activeItem?.BuyUrl,
    id: state.activeItem?.id,
  })
);
