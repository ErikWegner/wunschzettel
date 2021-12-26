import { createReducer } from "@ngrx/store"

export const initialState = {
  items: [],
  isLoading: false,
}

export const wReducer = createReducer(
  initialState,
);
