import React from 'react';
import { Flame, Sparkles, Award, Heart, ShieldCheck } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#1A1A1A] text-[#F4F1EA] border-b border-[#38342E] overflow-hidden" id="story-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2A2824] border border-[#38342E] text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Heritage • Three Generations of Culinary Mastery</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F1EA] leading-tight">
              Crafting Signature Indian Flavor Since 1978
            </h2>

            <p className="text-base text-[#C8C2B6] leading-relaxed font-sans border-l-2 border-[#B84A0E] pl-4">
              At <strong className="text-[#B84A0E]">Tadka Kitchen</strong>, food is an expression of warmth, generosity, and celebration. Founded by Master Chef Jagdish Singh in Amritsar, our kitchen honors time-honored Indian cooking methods.
            </p>

            <p className="text-sm text-[#A39D90] font-serif italic leading-relaxed">
              We never shortcut flavor with artificial colors or pre-packaged pastes. Every morning, our chefs roast whole cumin, cardamom, and mace over open iron pans before grinding them by hand. Our signature Dal Makhani simmers overnight on dying tandoor coals to achieve its deep, smoky velvet texture.
            </p>

            {/* Heritage Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#2A2824] border border-[#38342E]">
                <div className="p-2 bg-[#1A1A1A] border border-[#38342E] text-[#B84A0E] w-fit mb-2">
                  <Flame className="w-5 h-5 fill-[#B84A0E]" />
                </div>
                <h4 className="font-serif font-bold text-[#F4F1EA] text-base">Clay Tandoor Roasting</h4>
                <p className="text-xs text-[#A39D90] font-sans mt-1">Authentic clay ovens fired with natural oak charcoal at 700°F.</p>
              </div>

              <div className="p-4 bg-[#2A2824] border border-[#38342E]">
                <div className="p-2 bg-[#1A1A1A] border border-[#38342E] text-[#B84A0E] w-fit mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-[#F4F1EA] text-base">Whole Ground Spices</h4>
                <p className="text-xs text-[#A39D90] font-sans mt-1">Single-origin Kashmiri chillies and freshly churned white butter.</p>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden h-64 border border-[#38342E]">
                  <img
                    src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800"
                    alt="Tandoori Cooking"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 contrast-105"
                  />
                </div>
                <div className="overflow-hidden h-40 border border-[#38342E]">
                  <img
                    src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
                    alt="Authentic Spices"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 contrast-105"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="overflow-hidden h-40 border border-[#38342E]">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"
                    alt="Dal Makhani"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 contrast-105"
                  />
                </div>
                <div className="overflow-hidden h-64 border border-[#38342E]">
                  <img
                    src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800"
                    alt="Paneer Tikka"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 contrast-105"
                  />
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B84A0E] text-[#F4F1EA] p-4 border border-[#F4F1EA]/30 text-center shadow-2xl">
              <span className="font-serif font-bold text-3xl block">45+</span>
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#F4F1EA]">Years of Mastery</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
