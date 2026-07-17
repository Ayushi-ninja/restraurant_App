// src/data/offers.ts
export type Offer = {
  id: string;
  code: string;
  title: string;
  description: string;
  discountLabel: string;
  minOrder: number;
  expiresAt: string;
  color: string;
};

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'off1',
    code: 'CRAVE20',
    title: '20% off your first order',
    description: 'Valid on orders above $15 from any restaurant.',
    discountLabel: '20% OFF',
    minOrder: 15,
    expiresAt: '31 Aug 2026',
    color: '#FF5A1F',
  },
  {
    id: 'off2',
    code: 'FREEDEL',
    title: 'Free delivery weekend',
    description: 'Zero delivery fee on Saturdays and Sundays.',
    discountLabel: 'FREE DELIVERY',
    minOrder: 20,
    expiresAt: '30 Sep 2026',
    color: '#10B981',
  },
  {
    id: 'off3',
    code: 'BURGER5',
    title: '$5 off burgers',
    description: 'Save on The Smoky Grill burger combos.',
    discountLabel: '$5 OFF',
    minOrder: 25,
    expiresAt: '15 Aug 2026',
    color: '#3B82F6',
  },
  {
    id: 'off4',
    code: 'RAMEN15',
    title: '15% off ramen bowls',
    description: 'Exclusive for Sakura Ramen House menu items.',
    discountLabel: '15% OFF',
    minOrder: 18,
    expiresAt: '20 Aug 2026',
    color: '#8B5CF6',
  },
];
