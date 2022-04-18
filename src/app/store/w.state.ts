import { WishlistItem } from '../business/item';

export interface WishlistState {
  /** All existing categories */
  categories: string[];
  /** A known items */
  items: WishlistItem[];
  activeItem: WishlistItem | null;
}
