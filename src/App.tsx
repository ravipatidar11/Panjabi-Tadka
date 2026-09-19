import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { NavigationTab, MenuItem, CartItem, SpiceLevel } from './types';
import { MENU_ITEMS } from './data/menuData';
import { api } from './services/api';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { CateringSection } from './components/CateringSection';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { MenuItemModal } from './components/MenuItemModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [showAdmin, setShowAdmin] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getMenu().then(setMenuItems).catch((error) => console.error('Unable to load menu', error));
  }, []);

  // Cart helper functions
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    spiceLevel: SpiceLevel,
    instructions: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.item.id === item.id && ci.selectedSpiceLevel === spiceLevel
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (instructions) updated[existingIdx].specialInstructions = instructions;
        return updated;
      } else {
        return [
          ...prev,
          {
            item,
            quantity,
            selectedSpiceLevel: spiceLevel,
            specialInstructions: instructions
          }
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCart((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (payload: {
    customerName: string;
    phone: string;
    address?: string;
    orderType: 'pickup' | 'delivery';
    tipPercent: number;
    items: CartItem[];
  }) => api.createOrder({
    customer_name: payload.customerName,
    phone: payload.phone,
    address: payload.address,
    order_type: payload.orderType,
    tip_percent: payload.tipPercent,
    items: payload.items
  }).then((order) => order.order_code);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

  const handleTrackOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orderCode || !orderPhone) {
      setStatusMessage('Please enter both your order code and phone number.');
      return;
    }
    try {
      const status = await api.trackOrder(orderCode, orderPhone);
      setStatusMessage(`Order ${status.order_code} is currently ${status.status.replace('_', ' ')}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to find your order.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3DF] text-[#3B0D0D] selection:bg-[#D97706] selection:text-white">
      <div className="bg-[#1A1A1A] text-[#EBE7DF] px-4 py-2 text-[10px] uppercase tracking-widest">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <span>Live order tracking enabled</span>
          <button onClick={() => setShowAdmin(true)} className="border border-[#B84A0E] px-2 py-1 text-[#B84A0E]">Admin</button>
        </div>
      </div>

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Dynamic Tab / Scroll Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <form onSubmit={handleTrackOrder} className="flex flex-col gap-3 rounded-none border border-[#DED9CF] bg-[#F4F1EA] p-4 shadow-sm md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#666157]">Order code</label>
              <input
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="PT-ORD-000001"
                className="mt-2 w-full border border-[#DED9CF] bg-white px-3 py-2 text-sm outline-none focus:border-[#B84A0E]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#666157]">Phone</label>
              <input
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
                placeholder="your phone number"
                className="mt-2 w-full border border-[#DED9CF] bg-white px-3 py-2 text-sm outline-none focus:border-[#B84A0E]"
              />
            </div>
            <button type="submit" className="bg-[#B84A0E] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#F4F1EA]">Track Order</button>
          </form>
          {statusMessage && (
            <div className="mt-3 border border-[#DED9CF] bg-white px-4 py-3 text-sm text-[#1A1A1A]">{statusMessage}</div>
          )}
        </div>

        {activeTab === 'home' && (
          <>
            <HeroSection setActiveTab={setActiveTab} />
            <MenuSection
              items={menuItems}
              onSelectItem={(item) => setSelectedItemForModal(item)}
              onQuickAdd={handleAddToCart}
            />
            <ReservationSection />
            <CateringSection />
            <StorySection />
            <ReviewsSection />
          </>
        )}

        {activeTab === 'menu' && (
          <MenuSection
            items={menuItems}
            onSelectItem={(item) => setSelectedItemForModal(item)}
            onQuickAdd={handleAddToCart}
          />
        )}

        {activeTab === 'reservation' && <ReservationSection />}

        {activeTab === 'catering' && <CateringSection />}

        {activeTab === 'story' && (
          <>
            <StorySection />
            <ReviewsSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Dish Customization Modal */}
      <MenuItemModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

      <Analytics />
    </div>
  );
}
