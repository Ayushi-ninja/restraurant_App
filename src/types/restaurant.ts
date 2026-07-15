// src/types/restaurant.ts

/**
 * A restaurant listing in the app.
 */
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  /** Average rating out of 5 */
  rating: number;
  reviewCount: number;
  /** Estimated delivery time range in minutes, e.g. "25–35" */
  deliveryTime: string;
  /** Delivery fee in currency units */
  deliveryFee: number;
  /** Minimum order value for delivery */
  minimumOrder: number;
  imageUrl: string;
  logoUrl?: string;
  address: string;
  isOpen: boolean;
  /** Descriptive tags, e.g. ["Popular", "New", "Vegan-friendly"] */
  tags: string[];
  /** Distance from the user, e.g. "1.2 km" */
  distance?: string;
}

/**
 * A single item on a restaurant's menu.
 */
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  /** Section heading on the menu, e.g. "Starters", "Mains", "Desserts" */
  category: string;
  isAvailable: boolean;
  /** Shown with a "Popular" badge */
  isPopular: boolean;
  /** e.g. ["gluten", "dairy"] — optional */
  allergens?: string[];
  /** Calorie count — optional */
  calories?: number;
  /** Prep time in minutes — optional */
  prepTime?: number;
}
