// src/data/restaurants.ts
// Mock restaurant data — replace with API calls later

import type { Restaurant } from '../types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'The Smoky Grill',
    description:
      'Wood-fired burgers and steaks made with locally sourced beef. Known for our signature smoky sauce.',
    cuisine: ['American', 'BBQ', 'Burgers'],
    rating: 4.7,
    reviewCount: 1243,
    deliveryTime: '25–35',
    deliveryFee: 2.99,
    minimumOrder: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format',
    logoUrl: '',
    address: '14 Ember Lane, Brooklyn, NY 11201',
    isOpen: true,
    tags: ['Popular', 'Top Rated'],
    distance: '1.2 km',
  },
  {
    id: 'r2',
    name: 'Sakura Ramen House',
    description:
      'Authentic Japanese ramen with 24-hour tonkotsu broth, hand-pulled noodles, and seasonal toppings.',
    cuisine: ['Japanese', 'Ramen', 'Asian'],
    rating: 4.5,
    reviewCount: 876,
    deliveryTime: '30–45',
    deliveryFee: 1.99,
    minimumOrder: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format',
    logoUrl: '',
    address: '82 Cherry Blossom Ave, Manhattan, NY 10003',
    isOpen: true,
    tags: ['New', 'Trending'],
    distance: '2.0 km',
  },
  {
    id: 'r3',
    name: 'Verde Kitchen',
    description:
      'Plant-based meals full of flavor — wraps, bowls, and smoothies crafted for the health-conscious foodie.',
    cuisine: ['Vegan', 'Healthy', 'Salads'],
    rating: 4.3,
    reviewCount: 512,
    deliveryTime: '20–30',
    deliveryFee: 0,
    minimumOrder: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format',
    logoUrl: '',
    address: '5 Garden Square, Queens, NY 11101',
    isOpen: false,
    tags: ['Vegan-Friendly', 'Free Delivery'],
    distance: '3.1 km',
  },
];
