// src/data/customizations.ts
// Mock customization options keyed by menu item ID
// Categories: size, spice, add-ons — vary by food type

import type { ItemCustomization } from '../types/customization';

export const MOCK_CUSTOMIZATIONS: ItemCustomization[] = [
  // ── mi1: Classic Smash Burger ─────────────────────────────────────────
  {
    menuItemId: 'mi1',
    groups: [
      {
        id: 'size',
        label: 'Size',
        type: 'radio',
        required: true,
        options: [
          { id: 'regular', label: 'Regular (2 patties)', priceDelta: 0 },
          { id: 'large', label: 'Large (3 patties)', priceDelta: 3.5 },
        ],
      },
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'radio',
        required: true,
        options: [
          { id: 'mild', label: 'Mild', priceDelta: 0 },
          { id: 'medium', label: 'Medium', priceDelta: 0 },
          { id: 'hot', label: 'Hot 🌶', priceDelta: 0 },
        ],
      },
      {
        id: 'addons',
        label: 'Add-ons',
        type: 'checkbox',
        options: [
          { id: 'extra_cheese', label: 'Extra Cheese', priceDelta: 1.0 },
          { id: 'bacon', label: 'Crispy Bacon', priceDelta: 1.5 },
          { id: 'avocado', label: 'Sliced Avocado', priceDelta: 1.75 },
          { id: 'egg', label: 'Fried Egg', priceDelta: 1.0 },
        ],
      },
    ],
  },

  // ── mi2: BBQ Pulled Pork Sandwich ─────────────────────────────────────
  {
    menuItemId: 'mi2',
    groups: [
      {
        id: 'spice',
        label: 'Sauce Heat',
        type: 'radio',
        required: true,
        options: [
          { id: 'classic', label: 'Classic BBQ', priceDelta: 0 },
          { id: 'sweet', label: 'Sweet & Smoky', priceDelta: 0 },
          { id: 'hot', label: 'Fiery Habanero 🌶🌶', priceDelta: 0 },
        ],
      },
      {
        id: 'addons',
        label: 'Extras',
        type: 'checkbox',
        options: [
          { id: 'coleslaw_extra', label: 'Extra Coleslaw', priceDelta: 0.75 },
          { id: 'jalapenos', label: 'Extra Jalapeños', priceDelta: 0.5 },
        ],
      },
    ],
  },

  // ── mi3: Loaded Cheese Fries ──────────────────────────────────────────
  {
    menuItemId: 'mi3',
    groups: [
      {
        id: 'size',
        label: 'Portion',
        type: 'radio',
        required: true,
        options: [
          { id: 'regular', label: 'Regular', priceDelta: 0 },
          { id: 'large', label: 'Large', priceDelta: 2.0 },
        ],
      },
      {
        id: 'addons',
        label: 'Toppings',
        type: 'checkbox',
        options: [
          { id: 'sour_cream', label: 'Sour Cream', priceDelta: 0.75 },
          { id: 'guac', label: 'Guacamole', priceDelta: 1.25 },
          { id: 'chilli', label: 'Chilli Con Carne', priceDelta: 1.5 },
        ],
      },
    ],
  },

  // ── mi4: Tonkotsu Ramen ───────────────────────────────────────────────
  {
    menuItemId: 'mi4',
    groups: [
      {
        id: 'richness',
        label: 'Broth Richness',
        type: 'radio',
        required: true,
        options: [
          { id: 'light', label: 'Light (Assari)', priceDelta: 0 },
          { id: 'regular', label: 'Regular', priceDelta: 0 },
          { id: 'rich', label: 'Extra Rich (Kotteri)', priceDelta: 0 },
        ],
      },
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'radio',
        required: true,
        options: [
          { id: 'none', label: 'No Spice', priceDelta: 0 },
          { id: 'mild', label: 'Mild', priceDelta: 0 },
          { id: 'spicy', label: 'Spicy 🌶', priceDelta: 0 },
        ],
      },
      {
        id: 'toppings',
        label: 'Extra Toppings',
        type: 'checkbox',
        options: [
          { id: 'extra_egg', label: 'Extra Marinated Egg', priceDelta: 1.5 },
          { id: 'extra_pork', label: 'Extra Chashu Pork', priceDelta: 3.0 },
          { id: 'menma', label: 'Bamboo Shoots', priceDelta: 1.0 },
          { id: 'butter', label: 'Pat of Butter', priceDelta: 0.5 },
        ],
      },
    ],
  },

  // ── mi5: Spicy Miso Ramen ─────────────────────────────────────────────
  {
    menuItemId: 'mi5',
    groups: [
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'radio',
        required: true,
        options: [
          { id: 'mild', label: 'Mild', priceDelta: 0 },
          { id: 'medium', label: 'Medium', priceDelta: 0 },
          { id: 'hot', label: 'Extra Hot 🌶🌶', priceDelta: 0 },
        ],
      },
      {
        id: 'toppings',
        label: 'Add-ons',
        type: 'checkbox',
        options: [
          { id: 'extra_egg', label: 'Seasoned Egg', priceDelta: 1.5 },
          { id: 'nori', label: 'Nori Sheets', priceDelta: 0.75 },
        ],
      },
    ],
  },

  // ── mi7: Rainbow Grain Bowl ───────────────────────────────────────────
  {
    menuItemId: 'mi7',
    groups: [
      {
        id: 'protein',
        label: 'Protein Base',
        type: 'radio',
        required: true,
        options: [
          { id: 'farro', label: 'Farro (default)', priceDelta: 0 },
          { id: 'quinoa', label: 'Quinoa', priceDelta: 0 },
          { id: 'brown_rice', label: 'Brown Rice', priceDelta: 0 },
        ],
      },
      {
        id: 'addons',
        label: 'Extra Toppings',
        type: 'checkbox',
        options: [
          { id: 'extra_avocado', label: 'Extra Avocado', priceDelta: 1.5 },
          { id: 'tofu', label: 'Grilled Tofu', priceDelta: 2.0 },
          { id: 'seeds', label: 'Seed & Nut Mix', priceDelta: 1.0 },
        ],
      },
    ],
  },
];

/** Get customization config for a specific menu item (undefined if none) */
export function getCustomizationForItem(menuItemId: string): ItemCustomization | undefined {
  return MOCK_CUSTOMIZATIONS.find((c) => c.menuItemId === menuItemId);
}
