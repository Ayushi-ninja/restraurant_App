// src/types/cart.ts

import type { MenuItem } from './restaurant';

/**
 * A single line-item in the user's active cart.
 */
export interface CartItem {
  /** The full MenuItem object — denormalized for display convenience */
  menuItem: MenuItem;
  quantity: number;
  /** Summary of selected variants (e.g. "Large", "Spicy", "Extra Cheese") */
  customizations?: string[];
  /** Price of the item + selected variants */
  unitPrice: number;
  /** User's free-text customisation note, e.g. "No onions please" */
  specialInstructions?: string;
  /** Computed: unitPrice × quantity */
  totalPrice: number;
}
