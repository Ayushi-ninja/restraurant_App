// src/types/order.ts

import type { Restaurant, MenuItem } from './restaurant';

/**
 * Lifecycle states for a placed order.
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * A frozen snapshot of a MenuItem inside a placed order.
 * Price is captured at time of order to prevent drift.
 */
export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  /** Price per unit at time of order */
  unitPrice: number;
  /** unitPrice × quantity */
  lineTotal: number;
  specialInstructions?: string;
}

/**
 * A completed or in-progress order.
 */
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  /** Denormalized snapshot of the restaurant at order time */
  restaurant: Pick<Restaurant, 'id' | 'name' | 'imageUrl' | 'logoUrl'>;
  items: OrderItem[];
  status: OrderStatus;
  /** Sum of all lineTotals */
  subtotal: number;
  deliveryFee: number;
  /** Any discount or promo applied */
  discount?: number;
  /** subtotal + deliveryFee − discount */
  total: number;
  /** ISO 8601 timestamp */
  createdAt: string;
  /** ISO 8601 timestamp — set once confirmed */
  estimatedDeliveryAt?: string;
  /** ISO 8601 timestamp — set when status = DELIVERED */
  deliveredAt?: string;
  /** Any special notes for the whole order */
  deliveryInstructions?: string;
}
