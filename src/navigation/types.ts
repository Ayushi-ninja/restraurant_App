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
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string; purpose: 'reset' | 'signup' };
  ResetPassword: { email: string };
  Tabs: NavigatorScreenParams<TabParamList>;
  RestaurantDetail: { restaurantId: string };
  FoodItemDetail: { menuItemId: string };
  Categories: { categoryId?: string } | undefined;
  Offers: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string; total: number };
  OrderTracking: undefined;
  OrderDetails: { orderId: string };
  RateReview: { orderId: string };
  Favorites: undefined;
  SavedAddresses: undefined;
  Placeholder: { title: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
