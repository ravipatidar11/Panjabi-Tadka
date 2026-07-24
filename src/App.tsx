import React, { useState } from 'react';
import { NavigationTab, MenuItem, CartItem, SpiceLevel } from './types';
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

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1e1b18] selection:bg-[#f26012] selection:text-white">
      
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
