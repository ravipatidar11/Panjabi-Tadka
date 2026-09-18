import React, { useEffect, useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3DF] text-[#3B0D0D] selection:bg-[#D97706] selection:text-white">
      
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

    </div>
  );
}
