export type NavigationTab = 'home' | 'menu' | 'reservation' | 'catering' | 'story' | 'contact';

export type SpiceLevel = 0 | 1 | 2 | 3; // 0: None, 1: Mild, 2: Medium, 3: Hot

export interface MenuItem {
  id: string;
  name: string;
  punjabiName?: string;
  description: string;
  price: number;
  category: 'starters' | 'tandoori' | 'mains' | 'rice' | 'breads' | 'desserts' | 'beverages' | 'specials';
  categoryLabel: string;
  image: string;
  spiceLevel: SpiceLevel;
  isVeg: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isBestseller?: boolean;
  calories?: number;
  portionSize?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSpiceLevel: SpiceLevel;
  specialInstructions?: string;
}

export interface ReservationDetails {
  id?: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  seatingPreference?: 'indoor' | 'patio' | 'booth' | 'private_dining';
  specialOccasion?: string;
  specialNotes?: string;
}

export interface CateringInquiry {
  eventType: string;
  guestCount: number;
  eventDate: string;
  packageType: string;
  name: string;
  email: string;
  phone: string;
  budgetRange?: string;
  dietaryRequirements?: string[];
  additionalNotes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  dishRecommended?: string;
  avatar?: string;
  source: 'Google' | 'Yelp' | 'OpenTable';
}
