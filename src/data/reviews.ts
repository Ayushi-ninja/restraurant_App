// src/data/reviews.ts
// Mock review data for all restaurants

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string; // ISO 8601
  helpful: number; // "helpful" vote count
}

export const MOCK_REVIEWS: Review[] = [
  // ── The Smoky Grill (r1) ──────────────────────────────────────────────
  {
    id: 'rv1',
    restaurantId: 'r1',
    userId: 'u2',
    userName: 'Jordan M.',
    avatarUrl: 'https://i.pravatar.cc/80?img=11',
    rating: 5,
    comment:
      'Absolutely the best smash burger in Brooklyn. The smoky sauce is legendary — I put it on everything now.',
    date: '2026-06-18T14:30:00Z',
    helpful: 42,
  },
  {
    id: 'rv2',
    restaurantId: 'r1',
    userId: 'u3',
    userName: 'Priya K.',
    avatarUrl: 'https://i.pravatar.cc/80?img=47',
    rating: 4,
    comment:
      'Cheesy fries were insane. Burger was great but took 35 mins. Worth the wait though, fresh off the grill.',
    date: '2026-05-30T18:00:00Z',
    helpful: 18,
  },
  {
    id: 'rv3',
    restaurantId: 'r1',
    userId: 'u4',
    userName: 'Liam O.',
    avatarUrl: 'https://i.pravatar.cc/80?img=33',
    rating: 5,
    comment:
      "Ordered for the office last Friday. Everyone was raving. The pulled pork sandwich is a hidden gem — don't sleep on it.",
    date: '2026-04-12T12:00:00Z',
    helpful: 31,
  },

  // ── Sakura Ramen House (r2) ────────────────────────────────────────────
  {
    id: 'rv4',
    restaurantId: 'r2',
    userId: 'u5',
    userName: 'Yuki T.',
    avatarUrl: 'https://i.pravatar.cc/80?img=20',
    rating: 5,
    comment:
      'Tonkotsu broth is the real deal — rich, creamy and full of depth. I felt like I was back in Fukuoka!',
    date: '2026-07-01T20:00:00Z',
    helpful: 56,
  },
  {
    id: 'rv5',
    restaurantId: 'r2',
    userId: 'u6',
    userName: 'Carlos R.',
    avatarUrl: 'https://i.pravatar.cc/80?img=60',
    rating: 4,
    comment:
      'Gyoza were perfectly crispy. Miso ramen had a nice kick. Delivery was warm and well-packaged.',
    date: '2026-06-22T19:30:00Z',
    helpful: 24,
  },

  // ── Verde Kitchen (r3) ────────────────────────────────────────────────
  {
    id: 'rv6',
    restaurantId: 'r3',
    userId: 'u7',
    userName: 'Sofia L.',
    avatarUrl: 'https://i.pravatar.cc/80?img=49',
    rating: 4,
    comment:
      'Love the grain bowl — colourful, filling and the tahini dressing is to die for. Portions are generous.',
    date: '2026-06-05T13:00:00Z',
    helpful: 15,
  },
  {
    id: 'rv7',
    restaurantId: 'r3',
    userId: 'u8',
    userName: 'Aiden C.',
    avatarUrl: 'https://i.pravatar.cc/80?img=17',
    rating: 3,
    comment:
      'Good vegan options but the restaurant was closed when I tried to order. Wish hours were clearer in the app.',
    date: '2026-05-14T11:00:00Z',
    helpful: 9,
  },
];

export function getReviewsByRestaurant(restaurantId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.restaurantId === restaurantId);
}
