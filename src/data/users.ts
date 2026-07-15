// src/data/users.ts
// Mock user data for development & testing

import type { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 012-3456',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    addresses: [
      {
        id: 'addr1',
        label: 'Home',
        street: '27 Maple Street, Apt 4B',
        city: 'Brooklyn',
        state: 'NY',
        zip: '11201',
        latitude: 40.6892,
        longitude: -73.9442,
      },
      {
        id: 'addr2',
        label: 'Work',
        street: '350 Fifth Avenue, Floor 12',
        city: 'New York',
        state: 'NY',
        zip: '10118',
        latitude: 40.7484,
        longitude: -73.9967,
      },
    ],
    defaultAddressId: 'addr1',
    createdAt: '2024-03-15T09:00:00Z',
  },
];

/** The default mock user — use to seed userStore in dev */
export const MOCK_USER = MOCK_USERS[0];
