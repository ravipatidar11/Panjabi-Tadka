import { AdminDashboardData, CateringInquiry, CartItem, CustomerOrderStatus, MenuItem, ReservationDetails } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
export const ADMIN_TOKEN_KEY = 'punjabi-tadka-admin-token';

async function request<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    },
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
  }) => request<{ order_code: string; total: number; status: string; payment_status: string; customer_name: string; phone: string }>('/api/orders', {
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
  }),
  trackOrder: (orderCode: string, phone: string) => request<CustomerOrderStatus>(`/api/orders/track?order_code=${encodeURIComponent(orderCode)}&phone=${encodeURIComponent(phone)}`),
  adminLogin: (username: string, password: string) => request<{ token: string; username: string; role: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  getAdminProfile: (token: string) => request<{ username: string; role: string }>('/api/admin/me', undefined, token),
  getAdminDashboard: (token: string) => request<AdminDashboardData>('/api/admin/dashboard', undefined, token),
  getAdminOrders: (token: string, status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<AdminDashboardData['orders']>(`/api/admin/orders${query}`, undefined, token);
  },
  updateOrderStatus: (token: string, orderId: number, payload: { status: string; payment_status?: string; admin_notes?: string }) =>
    request<{ order_id: number; status: string; payment_status: string }>(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }, token)
};
