// src/types/user.ts

/**
 * A saved delivery address associated with the user's account.
 */
export interface Address {
  id: string;
  /** Short label, e.g. "Home", "Work", "Other" */
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  /** Optional geo-coordinates for map display */
  latitude?: number;
  longitude?: number;
}

/**
 * An authenticated user's profile.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  addresses: Address[];
  defaultAddressId?: string;
  /** ISO 8601 timestamp */
  createdAt: string;
}
