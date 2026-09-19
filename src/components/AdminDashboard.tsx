import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, DollarSign, Search, ShieldCheck, Truck, Users } from 'lucide-react';
import { ADMIN_TOKEN_KEY, api } from '../services/api';
import { AdminDashboardData, AdminOrder, OrderStatus, PaymentStatus } from '../types';
import { formatINR } from '../utils/currency';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [token, setToken] = useState<string>(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadDashboard = async (authToken: string) => {
    try {
      const data = await api.getAdminDashboard(authToken);
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard.');
      setToken('');
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    loadDashboard(token).finally(() => setLoading(false));
    const interval = window.setInterval(() => {
      loadDashboard(token);
    }, 15000);
    return () => window.clearInterval(interval);
  }, [token]);

  const filteredOrders = useMemo(() => {
    if (!dashboard) return [] as AdminOrder[];
    return dashboard.orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || [
        order.order_code,
        order.customer_name,
        order.phone,
        order.status,
      ].some((value) => value.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [dashboard, search, statusFilter]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const auth = await api.adminLogin(username, password);
      localStorage.setItem(ADMIN_TOKEN_KEY, auth.token);
      setToken(auth.token);
      setUsername(auth.username);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setDashboard(null);
    setSearch('');
    setStatusFilter('all');
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const handleStatusChange = async (orderId: number, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    if (!token) return;
    try {
      await api.updateOrderStatus(token, orderId, {
        status,
        payment_status: paymentStatus,
        admin_notes: `Updated by ${username || 'admin'}`,
      });
      await loadDashboard(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed.');
    }
  };

  if (!token) {
    return (
      <div className="fixed inset-0 z-[70] bg-[#1A1A1A]/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FAF8F5] border border-[#DED9CF] text-[#1A1A1A] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#DED9CF] p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B84A0E]">Secure Access</p>
              <h2 className="font-serif text-2xl font-bold">Admin Login</h2>
            </div>
            <button onClick={onClose} className="border border-[#DED9CF] px-2 py-1 text-xs uppercase">Close</button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-[#666157] text-xs">
              <ShieldCheck className="w-4 h-4 text-[#B84A0E]" />
              Default admin credentials: admin / admin123
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#666157]">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full border border-[#DED9CF] bg-[#F4F1EA] p-3 text-sm outline-none focus:border-[#B84A0E]"
                placeholder="admin"
                required
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#666157]">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-[#DED9CF] bg-[#F4F1EA] p-3 text-sm outline-none focus:border-[#B84A0E]"
                placeholder="••••••••"
                required
              />
            </label>

            {error && (
              <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B84A0E] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#F4F1EA] disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const metrics = dashboard?.metrics ?? { total_orders: 0, revenue: 0, pending: 0, delivered: 0, cancelled: 0 };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#1A1A1A]/75 backdrop-blur-sm p-4">
      <div className="mx-auto max-w-7xl rounded-none bg-[#FAF8F5] text-[#1A1A1A] shadow-2xl border border-[#DED9CF]">
        <div className="flex flex-col gap-4 border-b border-[#DED9CF] bg-[#F4F1EA] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B84A0E]">Operations Hub</p>
            <h2 className="font-serif text-2xl font-bold">Punjabi Tadka Admin Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="border border-[#DED9CF] bg-white px-3 py-2 text-xs font-semibold">Signed in as {username || 'admin'}</span>
            <button onClick={handleLogout} className="border border-[#DED9CF] px-3 py-2 text-xs font-bold uppercase tracking-wider">Logout</button>
            <button onClick={onClose} className="bg-[#1A1A1A] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#F4F1EA]">Close</button>
          </div>
        </div>

        {error && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="space-y-6 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { label: 'Total Orders', value: metrics.total_orders, icon: Users },
              { label: 'Revenue', value: formatINR(metrics.revenue), icon: DollarSign },
              { label: 'Pending', value: metrics.pending, icon: Clock3 },
              { label: 'Delivered', value: metrics.delivered, icon: CheckCircle2 },
              { label: 'Cancelled', value: metrics.cancelled, icon: Truck },
            ].map((item) => (
              <div key={item.label} className="border border-[#DED9CF] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666157]">{item.label}</span>
                  <item.icon className="w-4 h-4 text-[#B84A0E]" />
                </div>
                <div className="mt-4 font-serif text-2xl font-bold">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border border-[#DED9CF] bg-white p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#666157]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order code, customer, or phone"
                className="w-full border border-[#DED9CF] bg-[#F4F1EA] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#B84A0E]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#DED9CF] bg-[#F4F1EA] px-3 py-2.5 text-sm outline-none focus:border-[#B84A0E]"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto border border-[#DED9CF] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F4F1EA] text-[#666157]">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Update</th>
                </tr>
              </thead>
              <tbody>
                {loading && !dashboard ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#666157]">Loading dashboard...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#666157]">No orders found for this filter.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.order_id} className="border-t border-[#DED9CF] align-top">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#1A1A1A]">{order.order_code}</div>
                        <div className="mt-1 text-xs text-[#666157]">{new Date(order.created_at).toLocaleString()}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold">{order.customer_name}</div>
                        <div className="text-xs text-[#666157]">{order.phone}</div>
                        <div className="text-xs text-[#666157]">{order.order_type}</div>
                        {order.address && <div className="mt-1 text-xs text-[#666157]">{order.address}</div>}
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={`${order.order_id}-${idx}`} className="text-xs text-[#666157]">
                              {item.quantity} × {item.name}
                              {item.special_instructions ? ` • ${item.special_instructions}` : ''}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#B84A0E]">{formatINR(order.total)}</td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-[#DED9CF] bg-[#F4F1EA] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-[#DED9CF] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                          {PAYMENT_LABELS[order.payment_status]}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value as OrderStatus)}
                            className="border border-[#DED9CF] bg-[#F4F1EA] px-2 py-1.5 text-xs outline-none focus:border-[#B84A0E]"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                            ))}
                          </select>
                          <select
                            value={order.payment_status}
                            onChange={(e) => handleStatusChange(order.order_id, order.status, e.target.value as PaymentStatus)}
                            className="border border-[#DED9CF] bg-[#F4F1EA] px-2 py-1.5 text-xs outline-none focus:border-[#B84A0E]"
                          >
                            {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
