// src/data/orders.ts
export type MockOrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
};

export type MockOrder = {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantId: string;
  status: 'Preparing' | 'Out for delivery' | 'Delivered' | 'Cancelled';
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  eta?: string;
  date: string;
  address: string;
  paymentMethod: string;
  items: MockOrderItem[];
};

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord_84920',
    restaurantName: 'The Smoky Grill',
    restaurantImage:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format',
    restaurantId: 'r1',
    status: 'Preparing',
    itemCount: 3,
    subtotal: 28.99,
    deliveryFee: 2.99,
    discount: 0,
    total: 31.98,
    eta: '1:15 PM',
    date: 'Today',
    address: "Alex's Home — 27 Maple Street, Apt 4B",
    paymentMethod: 'Credit Card •••• 4242',
    items: [
      {
        id: 'mi1',
        name: 'Classic Smash Burger',
        quantity: 2,
        unitPrice: 12.99,
        imageUrl:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format',
      },
      {
        id: 'mi3',
        name: 'Loaded Cheese Fries',
        quantity: 1,
        unitPrice: 6.99,
        imageUrl:
          'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format',
      },
    ],
  },
  {
    id: 'ord_84812',
    restaurantName: 'Sakura Ramen House',
    restaurantImage:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format',
    restaurantId: 'r2',
    status: 'Delivered',
    itemCount: 2,
    subtotal: 22.0,
    deliveryFee: 2.5,
    discount: 0,
    total: 24.5,
    date: '12 Jul, 7:30 PM',
    address: "Alex's Home — 27 Maple Street, Apt 4B",
    paymentMethod: 'UPI',
    items: [
      {
        id: 'mi4',
        name: 'Tonkotsu Ramen',
        quantity: 1,
        unitPrice: 14.5,
        imageUrl:
          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format',
      },
      {
        id: 'mi5',
        name: 'Gyoza (6 pc)',
        quantity: 1,
        unitPrice: 7.5,
        imageUrl:
          'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format',
      },
    ],
  },
  {
    id: 'ord_84705',
    restaurantName: 'Verde Kitchen',
    restaurantImage:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format',
    restaurantId: 'r3',
    status: 'Cancelled',
    itemCount: 4,
    subtotal: 39.0,
    deliveryFee: 3.0,
    discount: 0,
    total: 42.0,
    date: '05 Jul, 1:00 PM',
    address: 'Work — 350 Fifth Avenue, Floor 12',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        id: 'mi8',
        name: 'Buddha Bowl',
        quantity: 2,
        unitPrice: 13.5,
        imageUrl:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format',
      },
      {
        id: 'mi9',
        name: 'Green Smoothie',
        quantity: 2,
        unitPrice: 6.0,
        imageUrl:
          'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&auto=format',
      },
    ],
  },
];

export function getOrderById(orderId: string) {
  return MOCK_ORDERS.find((o) => o.id === orderId);
}
