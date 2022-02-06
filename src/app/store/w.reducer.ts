import { createReducer } from "@ngrx/store"
import { WishlistState } from './w.state';

export const initialState = {
  categories: [],
  items: [],
};

export const wReducer = createReducer<WishlistState>(initialState);
