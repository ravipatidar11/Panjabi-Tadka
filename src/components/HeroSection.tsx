import React from 'react';
import { NavigationTab } from '../types';
import { Calendar, UtensilsCrossed, Star, Flame, ShieldCheck, Clock, ArrowRight, Award } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface HeroSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  return (
    <div className="relative overflow-hidden bg-[#1A1A1A] text-[#F4F1EA] border-b border-[#38342E]">
      {/* Editorial Watermark / Issue Background Header */}
      <div className="absolute top-4 right-8 text-[120px] font-serif font-bold text-[#2A2824]/40 select-none pointer-events-none leading-none tracking-tighter hidden lg:block">
        SPICE
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A2824] border border-[#38342E] text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Flame className="w-3.5 h-3.5 fill-[#B84A0E]" />
              <span>Amritsar to your table • Authentic Punjabi cooking</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4F1EA] leading-[1.15]">
              True Taste of Punjab, <br />
              <span className="font-serif italic font-normal text-[#B84A0E]">
                Served with warmth and tradition.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#C8C2B6] max-w-2xl leading-relaxed font-sans font-normal border-l-2 border-[#B84A0E] pl-4">
              Experience the rich aromas of 16-hour slow-cooked Dal Makhani, charred tandoori delicacies, and fresh handmade breads. Crafted for family gatherings, festive celebrations, and everyday cravings.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('menu')}
                className="px-6 py-3 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all border border-[#B84A0E]"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Menu & Order</span>
              </button>

              <button
                onClick={() => setActiveTab('reservation')}
                className="px-6 py-3 bg-transparent hover:bg-[#2A2824] text-[#F4F1EA] border border-[#524C42] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all hover:border-[#B84A0E]"
              >
                <Calendar className="w-4 h-4 text-[#B84A0E]" />
                <span>Reserve a Table</span>
              </button>

              <button
                onClick={() => setActiveTab('catering')}
                className="px-4 py-3 text-[#C8C2B6] hover:text-[#F4F1EA] font-semibold text-xs uppercase tracking-wider flex items-center gap-1 hover:underline"
              >
                <span>Catering Packages</span>
                <ArrowRight className="w-4 h-4 text-[#B84A0E]" />
              </button>
            </div>

            {/* Badges Bar */}
            <div className="pt-6 border-t border-[#38342E] grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#2A2824] border border-[#38342E] text-[#B84A0E]">
                  <Star className="w-4 h-4 fill-[#B84A0E]" />
                </div>
                <div>
                  <div className="font-serif font-bold text-[#F4F1EA] text-sm">4.9 / 5.0 Rating</div>
                  <div className="text-[11px] text-[#A39D90] uppercase tracking-wider">1,200+ Reviews</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#2A2824] border border-[#38342E] text-[#B84A0E]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif font-bold text-[#F4F1EA] text-sm">100% Halal</div>
                  <div className="text-[11px] text-[#A39D90] uppercase tracking-wider">Fresh Ingredients</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#2A2824] border border-[#38342E] text-[#B84A0E]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif font-bold text-[#F4F1EA] text-sm">Clay Tandoor</div>
                  <div className="text-[11px] text-[#A39D90] uppercase tracking-wider">Wood Charcoal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Grid / Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2 bg-[#2A2824] border border-[#38342E]">
              <div className="relative h-80 sm:h-96 overflow-hidden border border-[#38342E]">
                <img
                  src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=1000"
                  alt="Punjabi Tadka Signature Dish"
                  className="w-full h-full object-cover grayscale-15 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent" />
                
                {/* Floating Dish Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-4 bg-[#1A1A1A]/95 backdrop-blur-md border border-[#38342E] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#B84A0E]">
                      ★ Chef's Special Feature
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F4F1EA]">
                      Royal Murgh Makhani
                    </h3>
                    <p className="text-xs text-[#C8C2B6] font-serif italic">
                      Tandoori grilled chicken in velvet butter gravy
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-serif font-bold text-[#B84A0E]">{formatINR(1640)}</span>
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="block text-[10px] uppercase font-bold tracking-wider text-[#A39D90] underline hover:text-[#F4F1EA] mt-0.5"
                    >
                      View Dish
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Mini Food Gallery */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="relative overflow-hidden h-20 border border-[#38342E] group cursor-pointer" onClick={() => setActiveTab('menu')}>
                  <img
                    src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=300"
                    alt="Paneer Tikka"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/50 flex items-end p-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4F1EA] truncate">Paneer Tikka</span>
                  </div>
                </div>

                <div className="relative overflow-hidden h-20 border border-[#38342E] group cursor-pointer" onClick={() => setActiveTab('menu')}>
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300"
                    alt="Dal Makhani"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/50 flex items-end p-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4F1EA] truncate">Dal Makhani</span>
                  </div>
                </div>

                <div className="relative overflow-hidden h-20 border border-[#38342E] group cursor-pointer" onClick={() => setActiveTab('menu')}>
                  <img
                    src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=300"
                    alt="Mango Lassi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/50 flex items-end p-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4F1EA] truncate">Mango Lassi</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
