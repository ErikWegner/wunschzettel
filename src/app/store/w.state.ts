import { WishlistItem } from '../business/item';

export interface WishlistState {
  /** All existing categories */
  categories: string[];
  /** All known items */
  items: WishlistItem[];
  activeItem: WishlistItem | null;
  reservationDialogVisible: boolean;
}
