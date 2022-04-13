import { createReducer, on } from '@ngrx/store';
import { itemsLoaded } from './w.actions';
import { WishlistState } from './w.state';

export const initialState: WishlistState = {
  categories: [],
  items: [],
  activeItem: null,
};

export const wReducer = createReducer<WishlistState>(
  initialState,
  on(
    itemsLoaded,
    (state, p): WishlistState => ({
      ...state,
      categories: p.items
        .map((i) => i.Category)
        .reduce((a, c) => {
          if (a.indexOf(c) === -1) {
            a.push(c);
          }
          return a;
        }, [] as string[])
        .sort(),
    })
  )
);
