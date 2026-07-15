// src/navigation/types.ts
// Type-safe navigation param lists for React Navigation

import type { NavigatorScreenParams } from '@react-navigation/native';

// ─── Tab Navigator ────────────────────────────────────────────────────────────
export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

// ─── Root Stack (wraps tabs + modal/push screens) ────────────────────────────
export type RootStackParamList = {
  /** Initial app screen to determine routing */
  Splash: undefined;
  /** Onboarding welcome slider */
  Onboarding: undefined;
  /** Authenticated user log in */
  Login: undefined;
  /** Authenticated user sign up */
  Signup: undefined;
  /** The bottom-tab shell */
  Tabs: NavigatorScreenParams<TabParamList>;
  /** Restaurant menu page */
  RestaurantDetail: { restaurantId: string };
  /** Shopping cart overview */
  Cart: undefined;
  /** Order summary & payment */
  Checkout: undefined;
  /** Live order tracking */
  OrderTracking: undefined;
  /** Saved favorite restaurants and dishes */
  Favorites: undefined;
  /** Manage delivery addresses */
  SavedAddresses: undefined;
  /** Generic placeholder for unimplemented screens */
  Placeholder: { title: string };
};

// ─── Declaration merging so useNavigation() is typed globally ─────────────────
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
