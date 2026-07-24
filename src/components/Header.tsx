import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Utensils, ShoppingBag, Calendar, Phone, Menu, X, Flame, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  cartCount: number;
  cartTotal: number;
  setIsCartOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  setIsCartOpen
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu & Order' },
    { id: 'reservation', label: 'Book Table' },
    { id: 'catering', label: 'Catering & Events' },
    { id: 'story', label: 'Our Story' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#DED9CF] transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-[#1A1A1A] text-[#EBE7DF] text-[11px] py-1.5 px-4 tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center text-[#B84A0E] font-semibold tracking-widest">
              <Flame className="w-3.5 h-3.5 mr-1 fill-[#B84A0E]" /> Clay Tandoor & Heritage Spices
            </span>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:inline text-stone-300 font-serif italic text-xs capitalize">Vol. XXIV — Open Today: 11:30 AM – 10:30 PM</span>
          </div>
          <div className="flex items-center gap-4 text-[#EBE7DF]/90 text-[11px]">
            <span className="flex items-center gap-1 hover:text-[#B84A0E] transition-colors cursor-pointer" onClick={() => handleNavClick('reservation')}>
              <MapPin className="w-3 h-3 text-[#B84A0E]" /> 452 Heritage Way, San Jose, CA
            </span>
            <a href="tel:4085550199" className="hidden sm:flex items-center gap-1 text-[#B84A0E] font-medium hover:underline">
              <Phone className="w-3 h-3" /> (408) 555-0199
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-11 h-11 bg-[#1A1A1A] border border-[#B84A0E] flex items-center justify-center transition-transform group-hover:scale-105">
              <Flame className="w-5 h-5 text-[#B84A0E] fill-[#B84A0E]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] block leading-none">
                Punjabi <span className="font-serif italic font-normal text-[#B84A0E]">Tadka</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#666157] font-semibold block mt-1">
                Heritage Cuisine • Est. 1998
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === item.id
                    ? 'text-[#B84A0E] border-b-2 border-[#B84A0E] bg-[#EBE7DF]/50'
                    : 'text-[#38342E] hover:text-[#B84A0E] hover:bg-[#EBE7DF]/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions (Reservation + Cart + Mobile Toggle) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('reservation')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#F4F1EA] transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 border border-[#B84A0E]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Order Bag</span>
              {cartCount > 0 && (
                <span className="bg-[#1A1A1A] text-[#F4F1EA] text-[10px] px-2 py-0.5 font-bold ml-1">
                  {cartCount} • ${cartTotal.toFixed(2)}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1A1A] hover:bg-[#EBE7DF] focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DED9CF] bg-[#F4F1EA] px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider text-left border-b border-[#DED9CF]/50 ${
                  activeTab === item.id
                    ? 'text-[#B84A0E] bg-[#EBE7DF]'
                    : 'text-[#1A1A1A] hover:bg-[#EBE7DF]'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-[#666157]">→</span>
              </button>
            ))}
            
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('reservation')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest"
              >
                <Calendar className="w-4 h-4 text-[#B84A0E]" />
                <span>Book Table Online</span>
              </button>
              
              <button
                onClick={() => handleNavClick('catering')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#EBE7DF] text-[#1A1A1A] border border-[#DED9CF] font-bold text-xs uppercase tracking-widest"
              >
                <Utensils className="w-4 h-4 text-[#B84A0E]" />
                <span>Catering & Event Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
