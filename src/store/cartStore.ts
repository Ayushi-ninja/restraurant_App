// src/store/cartStore.ts
// Zustand store for the active cart (single restaurant at a time)

import { create } from 'zustand';
import type { MenuItem } from '../types';
import type { CartItem } from '../types';

interface CartState {
  /** The restaurant this cart belongs to — enforces single-restaurant carts */
  restaurantId: string | null;
  items: CartItem[];

  // ── Derived selectors ────────────────────────────────────────────────────
  totalItems: () => number;
  subtotal: () => number;

  // ── Actions ──────────────────────────────────────────────────────────────
  /** Add or increment a menu item in the cart */
  addItem: (menuItem: MenuItem, unitPrice: number, customizations?: string[], specialInstructions?: string) => void;
  /** Decrement quantity; removes if quantity reaches 0 */
  removeItem: (menuItemId: string) => void;
  /** Set an exact quantity for an item (0 removes it) */
  setQuantity: (menuItemId: string, quantity: number) => void;
  /** Update special instructions for an existing cart item */
  updateInstructions: (menuItemId: string, instructions: string) => void;
  /** Wipe the cart (e.g. after order placed or restaurant changed) */
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  items: [],

  // ── Derived ─────────────────────────────────────────────────────────────
  totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
  subtotal: () => get().items.reduce((acc, item) => acc + item.totalPrice, 0),

  // ── Actions ─────────────────────────────────────────────────────────────
  addItem: (menuItem, unitPrice, customizations, specialInstructions = '') => {
    const { items, restaurantId } = get();

    // If cart belongs to a different restaurant, clear it first
    if (restaurantId && restaurantId !== menuItem.restaurantId) {
      set({ items: [], restaurantId: menuItem.restaurantId });
    }

    const existing = items.find((i) => i.menuItem.id === menuItem.id);

    if (existing) {
      set({
        items: items.map((i) =>
          i.menuItem.id === menuItem.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                totalPrice: (i.quantity + 1) * i.unitPrice,
                customizations, // overwrite with latest
              }
            : i,
        ),
      });
    } else {
      set({
        restaurantId: menuItem.restaurantId,
        items: [
          ...items,
          {
            menuItem,
            quantity: 1,
            unitPrice,
            customizations,
            specialInstructions,
            totalPrice: unitPrice,
          },
        ],
      });
    }
  },

  removeItem: (menuItemId) => {
    const { items } = get();
    const existing = items.find((i) => i.menuItem.id === menuItemId);
    if (!existing) return;

    if (existing.quantity <= 1) {
      const updated = items.filter((i) => i.menuItem.id !== menuItemId);
      set({ items: updated, restaurantId: updated.length ? get().restaurantId : null });
    } else {
      set({
        items: items.map((i) =>
          i.menuItem.id === menuItemId
            ? {
                ...i,
                quantity: i.quantity - 1,
                totalPrice: (i.quantity - 1) * i.unitPrice,
              }
            : i,
        ),
      });
    }
  },

  setQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.menuItem.id === menuItemId
          ? { ...i, quantity, totalPrice: quantity * i.unitPrice }
          : i,
      ),
    });
  },

  updateInstructions: (menuItemId, instructions) => {
    set({
      items: get().items.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, specialInstructions: instructions } : i,
      ),
    });
  },

  clearCart: () => set({ items: [], restaurantId: null }),
}));
