import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Flame, MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, Check } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#C8C2B6] border-t border-[#38342E] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#B84A0E] flex items-center justify-center text-[#F4F1EA] border border-[#B84A0E]">
                <Flame className="w-5 h-5 fill-[#F4F1EA]" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#F4F1EA]">
                Punjabi <span className="text-[#B84A0E]">Tadka</span>
              </span>
            </div>

            <p className="text-xs text-[#A39D90] font-serif italic leading-relaxed">
              Authentic Punjabi dining, clay tandoor roasting, and royal event catering. Crafted with passion, fresh white butter, and 45+ years of family heritage.
            </p>

            <div className="flex items-center gap-3 text-[#A39D90] pt-1">
              <a href="#" className="p-2 bg-[#2A2824] border border-[#38342E] hover:text-[#B84A0E] hover:border-[#B84A0E] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#2A2824] border border-[#38342E] hover:text-[#B84A0E] hover:border-[#B84A0E] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Hours & Location */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F4F1EA] flex items-center gap-1.5 border-b border-[#38342E] pb-2">
              <Clock className="w-4 h-4 text-[#B84A0E]" />
              Opening Hours
            </h4>
            <ul className="text-xs space-y-2 text-[#A39D90]">
              <li className="flex justify-between">
                <span>Mon – Thu (Lunch):</span>
                <span className="text-[#F4F1EA] font-medium">11:30 AM – 2:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Mon – Thu (Dinner):</span>
                <span className="text-[#F4F1EA] font-medium">5:00 PM – 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Fri – Sun (Continuous):</span>
                <span className="text-[#B84A0E] font-bold">11:30 AM – 10:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F4F1EA] border-b border-[#38342E] pb-2">Quick Navigation</h4>
            <ul className="text-xs space-y-2">
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-[#B84A0E] transition-colors">
                  Full Menu & Online Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reservation')} className="hover:text-[#B84A0E] transition-colors">
                  Table Reservation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('catering')} className="hover:text-[#B84A0E] transition-colors">
                  Wedding & Event Catering
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('story')} className="hover:text-[#B84A0E] transition-colors">
                  Our Clay Tandoor Story
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Discount */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F4F1EA] border-b border-[#38342E] pb-2">Gazette Newsletter</h4>
            <p className="text-xs text-[#A39D90] font-serif italic">
              Subscribe for weekly chef special announcements and receive 15% off your next order.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full px-3.5 py-2 bg-[#2A2824] border border-[#38342E] text-xs text-[#F4F1EA] placeholder-[#A39D90] focus:outline-hidden focus:border-[#B84A0E]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E] flex items-center justify-center gap-1.5 transition-all"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Get 15% Discount</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#38342E] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A39D90] gap-4">
          <div>
            © {new Date().getFullYear()} Punjabi Tadka Gazette & Culinary House. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Health & Safety Certification</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
