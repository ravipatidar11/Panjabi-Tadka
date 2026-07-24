import React, { useState, useMemo } from 'react';
import { MENU_ITEMS } from '../data/menuData';
import { MenuItem, SpiceLevel } from '../types';
import { Search, Flame, Plus, Sparkles, Filter, Check } from 'lucide-react';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, quantity: number, spiceLevel: SpiceLevel, instructions: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItem, onQuickAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg' | 'gf'>('all');

  const categories = [
    { id: 'all', label: 'All Specialties' },
    { id: 'tandoori', label: 'Tandoori Specialties' },
    { id: 'mains', label: 'Main Course' },
    { id: 'starters', label: 'Starters & Chaat' },
    { id: 'breads', label: 'Fresh Clay Breads' },
    { id: 'rice', label: 'Biryani & Rice' },
    { id: 'beverages', label: 'Lassi & Drinks' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (dietaryFilter === 'veg' && !item.isVeg) return false;
      if (dietaryFilter === 'nonveg' && item.isVeg) return false;
      if (dietaryFilter === 'gf' && !item.isGlutenFree) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesPunjabi = item.punjabiName?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesPunjabi;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, dietaryFilter]);

  return (
    <section className="py-12 bg-[#F4F1EA] text-[#1A1A1A]" id="menu-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 border-b border-[#DED9CF] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBE7DF] border border-[#DED9CF] text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Flame className="w-3.5 h-3.5 fill-[#B84A0E]" />
            <span>Gazette Selection • Clay Tandoor & Heritage Spice Recipes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Culinary Menu & Offerings
          </h2>
          <p className="text-sm sm:text-base text-[#666157] font-serif italic max-w-xl mx-auto">
            "Every dish is prepared fresh using home-ground spice blends, brass handis, and authentic charcoal tandoor ovens."
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#EBE7DF] p-4 border border-[#DED9CF] mb-8 space-y-4">
          
          {/* Top Search & Dietary Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666157]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Butter Chicken, Naan, Lassi..."
                className="w-full pl-10 pr-4 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] placeholder-[#666157] focus:outline-hidden focus:border-[#B84A0E]"
              />
            </div>

            {/* Dietary Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                  dietaryFilter === 'all'
                    ? 'bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A]'
                    : 'bg-[#F4F1EA] text-[#666157] border-[#DED9CF] hover:bg-[#EBE7DF]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-[#F4F1EA] text-emerald-900 border-[#DED9CF] hover:bg-emerald-50'
                }`}
              >
                🌱 Veg Only
              </button>
              <button
                onClick={() => setDietaryFilter('nonveg')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                  dietaryFilter === 'nonveg'
                    ? 'bg-amber-900 text-white border-amber-900'
                    : 'bg-[#F4F1EA] text-amber-900 border-[#DED9CF] hover:bg-amber-50'
                }`}
              >
                🍗 Non-Veg
              </button>
              <button
                onClick={() => setDietaryFilter('gf')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                  dietaryFilter === 'gf'
                    ? 'bg-[#B84A0E] text-white border-[#B84A0E]'
                    : 'bg-[#F4F1EA] text-[#666157] border-[#DED9CF] hover:bg-[#EBE7DF]'
                }`}
              >
                🌾 Gluten-Free
              </button>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#DED9CF] scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#B84A0E] text-[#F4F1EA] border-[#B84A0E]'
                    : 'bg-[#F4F1EA] text-[#38342E] border-[#DED9CF] hover:bg-[#EBE7DF] hover:text-[#B84A0E]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#EBE7DF] border border-[#DED9CF]">
            <p className="text-sm text-[#666157] font-serif italic">No dishes match your selected search criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
              }}
              className="mt-3 text-xs font-bold uppercase tracking-widest text-[#B84A0E] underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-[#FAF8F5] border border-[#DED9CF] hover:border-[#B84A0E] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Dish Image */}
                <div className="relative h-48 w-full overflow-hidden cursor-pointer" onClick={() => onSelectItem(item)}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 contrast-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${
                      item.isVeg ? 'bg-emerald-900/90 text-white border-emerald-700' : 'bg-amber-900/90 text-white border-amber-700'
                    }`}>
                      {item.isVeg ? '🌱 Veg' : '🍗 Non-Veg'}
                    </span>

                    {item.isBestseller && (
                      <span className="px-2 py-0.5 bg-[#B84A0E] text-white text-[9px] font-bold uppercase tracking-widest border border-[#B84A0E]">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Price overlay at bottom */}
                  <div className="absolute bottom-2.5 right-2.5 bg-[#1A1A1A]/90 px-2.5 py-0.5 border border-[#38342E]">
                    <span className="text-[#F4F1EA] font-serif font-bold text-sm">${item.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Dish Body */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-[#EBE7DF]/30">
                  <div>
                    <div className="flex items-center justify-between gap-1 cursor-pointer" onClick={() => onSelectItem(item)}>
                      <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#B84A0E] transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    {item.punjabiName && (
                      <span className="text-xs font-serif italic text-[#B84A0E] block mb-2">
                        {item.punjabiName}
                      </span>
                    )}

                    <p className="text-xs text-[#524C42] line-clamp-2 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 mt-3 border-t border-[#DED9CF] flex items-center justify-between">
                    {/* Spice indicators */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.spiceLevel }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 text-[#B84A0E] fill-[#B84A0E]" />
                      ))}
                      {item.spiceLevel === 0 && (
                        <span className="text-[10px] text-[#666157] uppercase tracking-wider font-semibold">Mild</span>
                      )}
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => onQuickAdd(item, 1, item.spiceLevel, '')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#B84A0E] text-[#F4F1EA] text-[11px] font-bold uppercase tracking-wider transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
