import { createReducer, on } from '@ngrx/store';
import { itemsLoaded, setActiveItem } from './w.actions';
import { WishlistState } from './w.state';

export const initialState: WishlistState = {
  categories: [],
  items: [],
  activeItem: null,
  reservationDialogVisible: false,
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
      items: p.items,
    })
  ),
  on(
    setActiveItem,
    (state, p): WishlistState => ({
      ...state,
      activeItem: p.item ?? null,
      reservationDialogVisible: false,
    })
  )
);
