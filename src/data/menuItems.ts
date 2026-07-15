// src/data/menuItems.ts
// Mock menu items across all mock restaurants

import type { MenuItem } from '../types';

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // ── The Smoky Grill (r1) ─────────────────────────────────────────────────
  {
    id: 'mi1',
    restaurantId: 'r1',
    name: 'Classic Smash Burger',
    description:
      'Double smash patties, American cheese, pickles, onion, and our house smoky sauce on a brioche bun.',
    price: 12.99,
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format',
    category: 'Burgers',
    isAvailable: true,
    isPopular: true,
    allergens: ['gluten', 'dairy', 'egg'],
    calories: 720,
    prepTime: 12,
  },
  {
    id: 'mi2',
    restaurantId: 'r1',
    name: 'BBQ Pulled Pork Sandwich',
    description:
      '12-hour slow-cooked pulled pork, coleslaw, jalapeños, and tangy BBQ sauce on a toasted roll.',
    price: 11.49,
    imageUrl:
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format',
    category: 'Sandwiches',
    isAvailable: true,
    isPopular: false,
    allergens: ['gluten'],
    calories: 630,
    prepTime: 10,
  },
  {
    id: 'mi3',
    restaurantId: 'r1',
    name: 'Loaded Cheese Fries',
    description:
      'Crispy shoestring fries smothered in cheddar cheese sauce, crispy bacon, and green onions.',
    price: 6.99,
    imageUrl:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format',
    category: 'Sides',
    isAvailable: true,
    isPopular: true,
    allergens: ['gluten', 'dairy'],
    calories: 540,
    prepTime: 8,
  },

  // ── Sakura Ramen House (r2) ───────────────────────────────────────────────
  {
    id: 'mi4',
    restaurantId: 'r2',
    name: 'Tonkotsu Ramen',
    description:
      'Rich 24-hour pork bone broth, chashu pork belly, soft-boiled egg, bamboo shoots, and nori.',
    price: 15.99,
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format',
    category: 'Ramen',
    isAvailable: true,
    isPopular: true,
    allergens: ['gluten', 'egg', 'soy'],
    calories: 820,
    prepTime: 15,
  },
  {
    id: 'mi5',
    restaurantId: 'r2',
    name: 'Spicy Miso Ramen',
    description:
      'Umami-rich miso base with chilli oil, corn, bean sprouts, ground pork, and a seasoned egg.',
    price: 14.99,
    imageUrl:
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&auto=format',
    category: 'Ramen',
    isAvailable: true,
    isPopular: false,
    allergens: ['gluten', 'soy'],
    calories: 780,
    prepTime: 15,
  },
  {
    id: 'mi6',
    restaurantId: 'r2',
    name: 'Gyoza (6 pcs)',
    description:
      'Pan-fried pork and cabbage dumplings served with ponzu dipping sauce.',
    price: 7.49,
    imageUrl:
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format',
    category: 'Starters',
    isAvailable: true,
    isPopular: true,
    allergens: ['gluten', 'soy'],
    calories: 310,
    prepTime: 8,
  },

  // ── Verde Kitchen (r3) ────────────────────────────────────────────────────
  {
    id: 'mi7',
    restaurantId: 'r3',
    name: 'Rainbow Grain Bowl',
    description:
      'Farro, roasted sweet potato, avocado, pickled red cabbage, edamame, and tahini-lemon dressing.',
    price: 13.49,
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format',
    category: 'Bowls',
    isAvailable: false,
    isPopular: true,
    allergens: ['sesame'],
    calories: 490,
    prepTime: 10,
  },
  {
    id: 'mi8',
    restaurantId: 'r3',
    name: 'Smoky Chickpea Wrap',
    description:
      'Spiced roasted chickpeas, hummus, cucumber, tomato, and herb dressing in a whole-wheat tortilla.',
    price: 10.99,
    imageUrl:
      'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=600&auto=format',
    category: 'Wraps',
    isAvailable: false,
    isPopular: false,
    allergens: ['gluten', 'sesame'],
    calories: 420,
    prepTime: 8,
  },
];

/** Helper: get all items for a given restaurant */
export function getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
  return MOCK_MENU_ITEMS.filter((item) => item.restaurantId === restaurantId);
}

/** Helper: get a single item by id */
export function getMenuItemById(id: string): MenuItem | undefined {
  return MOCK_MENU_ITEMS.find((item) => item.id === id);
}
