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

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface AdminOrderItem {
  item_id: string;
  name: string;
  quantity: number;
  spice_level: number;
  unit_price: number;
  special_instructions?: string | null;
}

export interface AdminOrder {
  order_id: number;
  order_code: string;
  customer_name: string;
  phone: string;
  order_type: 'pickup' | 'delivery';
  address?: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  tip_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
  items: AdminOrderItem[];
}

export interface AdminMetrics {
  total_orders: number;
  revenue: number;
  pending: number;
  delivered: number;
  cancelled: number;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  orders: AdminOrder[];
}

export interface CustomerOrderStatus {
  order_id: number;
  order_code: string;
  customer_name: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
  updated_at: string;
}
