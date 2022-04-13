import { WishlistItem } from '../business/item';

export interface WishlistState {
  categories: string[];
  items: WishlistItem[];
  activeItem: WishlistItem | null;
}
