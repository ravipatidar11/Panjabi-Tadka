import { CateringInquiry, CartItem, MenuItem, ReservationDetails } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || 'The request could not be completed.');
  }
  return response.json() as Promise<T>;
}

export const api = {
  getMenu: () => request<MenuItem[]>('/api/menu').then((items) =>
    items.map((item) => ({ ...item, price: Number(item.price) }))
  ),
  createOrder: (payload: {
    customer_name: string;
    phone: string;
    address?: string;
    order_type: 'pickup' | 'delivery';
    tip_percent: number;
    items: CartItem[];
  }) => request<{ order_code: string; total: number }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      items: payload.items.map((item) => ({
        item_id: item.item.id,
        quantity: item.quantity,
        spice_level: item.selectedSpiceLevel,
        special_instructions: item.specialInstructions || null
      }))
    })
  }),
  createReservation: (payload: ReservationDetails) => request<{ id: string; message: string }>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      seating_preference: payload.seatingPreference,
      special_occasion: payload.specialOccasion,
      special_notes: payload.specialNotes
    })
  }),
  createCateringBooking: (payload: CateringInquiry) => request<{ id: number; message: string }>('/api/catering', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      event_type: payload.eventType,
      event_date: payload.eventDate,
      guest_count: payload.guestCount,
      package_type: payload.packageType,
      budget_range: payload.budgetRange || '',
      additional_notes: payload.additionalNotes
    })
  }),
  createContactMessage: (email: string, message: string) => request<{ message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ email, message })
  })
};
