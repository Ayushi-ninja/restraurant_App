// src/types/customization.ts
// Types for menu item customization options

/** A single choice within a radio (single-select) group */
export interface RadioOption {
  id: string;
  label: string;
  priceDelta: number; // 0 for default, >0 for premium options
}

/** A single toggleable add-on (multi-select) */
export interface CheckboxOption {
  id: string;
  label: string;
  priceDelta: number;
  isDefault?: boolean; // pre-ticked
}

/** A grouping of related options */
export interface CustomizationGroup {
  id: string;
  label: string;
  type: 'radio' | 'checkbox';
  required?: boolean;
  options: RadioOption[] | CheckboxOption[];
}

/** Full customization config for a menu item */
export interface ItemCustomization {
  menuItemId: string;
  groups: CustomizationGroup[];
}
