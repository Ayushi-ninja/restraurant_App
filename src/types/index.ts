// src/types/index.ts — barrel re-export for clean imports

export type { Restaurant, MenuItem } from './restaurant';
export type { CartItem } from './cart';
export type { Order, OrderItem } from './order';
export { OrderStatus } from './order';
export type { User, Address } from './user';
export type {
  RadioOption,
  CheckboxOption,
  CustomizationGroup,
  ItemCustomization,
} from './customization';
