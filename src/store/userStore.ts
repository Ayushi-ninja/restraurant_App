// src/store/userStore.ts
// Zustand store for the authenticated user session

import { create } from 'zustand';
import type { User, Address } from '../types';

interface UserState {
  /** null = guest / unauthenticated */
  user: User | null;
  isAuthenticated: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────
  /** Simulate login — replace with real auth later */
  login: (user: User) => void;
  logout: () => void;
  /** Update display name, phone, avatar, etc. */
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatarUrl'>>) => void;
  /** Add a new delivery address */
  addAddress: (address: Address) => void;
  /** Remove an existing address by id */
  removeAddress: (addressId: string) => void;
  /** Set the default delivery address */
  setDefaultAddress: (addressId: string) => void;
  /** Convenience: get the currently selected delivery address */
  defaultAddress: () => Address | undefined;

  // Favorites
  favoriteRestaurantIds: string[];
  favoriteDishIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteDish: (id: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  favoriteRestaurantIds: [],
  favoriteDishIds: [],

  login: (user) => set({ user, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),

  updateProfile: (updates) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, ...updates } });
  },

  addAddress: (address) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, addresses: [...user.addresses, address] } });
  },

  removeAddress: (addressId) => {
    const { user } = get();
    if (!user) return;
    const addresses = user.addresses.filter((a) => a.id !== addressId);
    set({
      user: {
        ...user,
        addresses,
        defaultAddressId:
          user.defaultAddressId === addressId
            ? addresses[0]?.id ?? undefined
            : user.defaultAddressId,
      },
    });
  },

  setDefaultAddress: (addressId) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, defaultAddressId: addressId } });
  },

  defaultAddress: () => {
    const { user } = get();
    if (!user) return undefined;
    return user.addresses.find((a) => a.id === user.defaultAddressId);
  },

  toggleFavoriteRestaurant: (id) => {
    const { favoriteRestaurantIds } = get();
    if (favoriteRestaurantIds.includes(id)) {
      set({ favoriteRestaurantIds: favoriteRestaurantIds.filter((fid) => fid !== id) });
    } else {
      set({ favoriteRestaurantIds: [...favoriteRestaurantIds, id] });
    }
  },

  toggleFavoriteDish: (id) => {
    const { favoriteDishIds } = get();
    if (favoriteDishIds.includes(id)) {
      set({ favoriteDishIds: favoriteDishIds.filter((fid) => fid !== id) });
    } else {
      set({ favoriteDishIds: [...favoriteDishIds, id] });
    }
  },
}));
