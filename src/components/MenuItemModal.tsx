import React, { useState } from 'react';
import { MenuItem, SpiceLevel } from '../types';
import { X, Flame, Plus, Minus, ShoppingBag, Check, ShieldCheck } from 'lucide-react';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, spiceLevel: SpiceLevel, instructions: string) => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(item.spiceLevel);
  const [instructions, setInstructions] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(item, quantity, spiceLevel, instructions);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  const spiceLabels = [
    { level: 0, label: 'No Spice', desc: 'Mild palette' },
    { level: 1, label: 'Mild', desc: 'Gentle warmth' },
    { level: 2, label: 'Medium', desc: 'Traditional Punjabi heat' },
    { level: 3, label: 'Hot', desc: 'For true spice lovers' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#DED9CF] shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-[#1A1A1A] text-[#F4F1EA] border border-[#38342E] hover:bg-[#B84A0E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Hero Image */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 border-b border-[#DED9CF]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] border ${
              item.isVeg ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-amber-950 text-amber-300 border-amber-700'
            }`}>
              {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>

            {item.isBestseller && (
              <span className="px-2.5 py-0.5 bg-[#B84A0E] text-[#F4F1EA] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#B84A0E]">
                ★ Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Dish Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <div className="flex items-start justify-between gap-2 border-b border-[#DED9CF] pb-3">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">{item.name}</h2>
                {item.punjabiName && (
                  <span className="text-xs font-serif italic font-bold text-[#B84A0E] block mt-0.5">
                    {item.punjabiName}
                  </span>
                )}
              </div>
              <span className="font-serif font-bold text-2xl text-[#B84A0E]">
                ${item.price.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-[#524C42] mt-3 font-serif italic leading-relaxed">
              "{item.description}"
            </p>

            {item.portionSize && (
              <p className="text-[10px] uppercase tracking-wider text-[#666157] font-semibold mt-2">
                Portion: {item.portionSize}
              </p>
            )}
          </div>

          {/* Spice Level Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#B84A0E]" />
              Select Spice Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {spiceLabels.map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpiceLevel(s.level as SpiceLevel)}
                  className={`p-2.5 border text-left transition-all ${
                    spiceLevel === s.level
                      ? 'border-[#B84A0E] bg-[#EBE7DF] text-[#B84A0E] font-bold'
                      : 'border-[#DED9CF] bg-[#F4F1EA] text-[#524C42] hover:border-[#B84A0E]'
                  }`}
                >
                  <div className="text-xs font-bold">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-[#666157] mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-1">
              Special Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra cilantro, light oil, nut allergy..."
              className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
            />
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-[#DED9CF]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Quantity
            </span>
            <div className="flex items-center gap-3 bg-[#F4F1EA] px-3 py-1 border border-[#DED9CF]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 hover:text-[#B84A0E] text-[#1A1A1A] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-6 text-center text-[#1A1A1A]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 hover:text-[#B84A0E] text-[#1A1A1A] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Add to Order Button */}
        <div className="p-4 bg-[#F4F1EA] border-t border-[#DED9CF]">
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`w-full py-3 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
              isAdded
                ? 'bg-emerald-800 text-[#F4F1EA] border-emerald-800'
                : 'bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] border-[#B84A0E]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Order!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Order • ${(item.price * quantity).toFixed(2)}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
