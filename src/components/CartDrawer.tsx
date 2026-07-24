import React, { useState } from 'react';
import { CartItem, SpiceLevel } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, Flame, Clock, MapPin, CheckCircle, ArrowRight, Truck, Store } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [placedOrderCode, setPlacedOrderCode] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const tax = subtotal * 0.085;
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const tipAmount = subtotal * (tipPercent / 100);
  const total = subtotal + tax + deliveryFee + tipAmount;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Please enter your name and phone number for order updates.');
      return;
    }
    if (orderType === 'delivery' && !address) {
      alert('Please enter your delivery address.');
      return;
    }

    const orderNum = 'PT-ORD-' + Math.floor(1000 + Math.random() * 9000);
    setPlacedOrderCode(orderNum);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        <div className="w-screen max-w-md bg-[#FAF8F5] text-[#1A1A1A] shadow-2xl flex flex-col justify-between border-l border-[#DED9CF]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#DED9CF] bg-[#F4F1EA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B84A0E]" />
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Your Order • Gazette Dispatch</h2>
              <span className="bg-[#B84A0E] text-[#F4F1EA] text-[10px] font-bold px-2 py-0.5 border border-[#B84A0E]">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#EBE7DF] border border-transparent hover:border-[#DED9CF] text-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content / Order Placed View */}
          {placedOrderCode ? (
            <div className="p-6 overflow-y-auto flex-1 text-center flex flex-col justify-center space-y-4">
              <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B84A0E]">
                Order Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                Thank you, {customerName}!
              </h3>

              <div className="p-4 bg-[#F4F1EA] border border-[#DED9CF] text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#DED9CF] pb-2">
                  <span className="text-[#666157] uppercase tracking-wider font-semibold">Order Number:</span>
                  <span className="font-mono font-bold text-[#B84A0E]">{placedOrderCode}</span>
                </div>
                <div className="flex justify-between border-b border-[#DED9CF] pb-2">
                  <span className="text-[#666157] uppercase tracking-wider font-semibold">Fulfillment Type:</span>
                  <span className="font-bold text-[#1A1A1A] capitalize">{orderType}</span>
                </div>
                <div className="flex justify-between border-b border-[#DED9CF] pb-2">
                  <span className="text-[#666157] uppercase tracking-wider font-semibold">Est. Completion:</span>
                  <span className="font-bold text-[#1A1A1A]">25 – 35 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666157] uppercase tracking-wider font-semibold">Total Charged:</span>
                  <span className="font-serif font-bold text-sm text-[#B84A0E]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-[#1A1A1A] text-[#F4F1EA] text-left space-y-2 border border-[#38342E]">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B84A0E] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#B84A0E]" />
                  Live Kitchen Status
                </div>
                <p className="text-xs text-[#C8C2B6] font-serif italic">
                  Your order is currently being prepared in our clay tandoor kitchen. SMS updates sent to {phone}.
                </p>
              </div>

              <button
                onClick={() => {
                  onClearCart();
                  setPlacedOrderCode(null);
                  setIsCheckingOut(false);
                  onClose();
                }}
                className="w-full py-3 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E]"
              >
                Close & Return to Menu
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="p-6 text-center flex-1 flex flex-col items-center justify-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#B84A0E]/50" />
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Your order is empty</h3>
              <p className="text-xs text-[#666157] font-serif italic">Explore our menu and add authentic Punjabi specialties to get started.</p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#B84A0E] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E]"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            /* Items & Checkout Form */
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              
              {/* Pickup vs Delivery Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-[#F4F1EA] p-1 border border-[#DED9CF]">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                    orderType === 'pickup'
                      ? 'bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A]'
                      : 'text-[#524C42] border-transparent hover:border-[#DED9CF]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-[#B84A0E]" />
                  <span>Pickup (20m)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                    orderType === 'delivery'
                      ? 'bg-[#B84A0E] text-[#F4F1EA] border-[#B84A0E]'
                      : 'text-[#524C42] border-transparent hover:border-[#DED9CF]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery (35m)</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((c, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white border border-[#DED9CF] flex gap-3 items-center justify-between"
                  >
                    <img
                      src={c.item.image}
                      alt={c.item.name}
                      className="w-14 h-14 object-cover border border-[#DED9CF]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-xs text-[#1A1A1A] truncate">{c.item.name}</h4>
                      <div className="text-[10px] text-[#666157] flex items-center gap-1 mt-0.5">
                        <Flame className="w-3 h-3 text-[#B84A0E] fill-[#B84A0E]" />
                        <span>Spice Lvl: {c.selectedSpiceLevel}</span>
                      </div>
                      {c.specialInstructions && (
                        <p className="text-[10px] text-[#B84A0E] font-serif italic truncate mt-0.5">"{c.specialInstructions}"</p>
                      )}
                      <div className="font-serif font-bold text-xs text-[#B84A0E] mt-1">
                        ${(c.item.price * c.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-[#F4F1EA] px-2 py-1 border border-[#DED9CF]">
                      <button
                        onClick={() => onUpdateQuantity(index, c.quantity - 1)}
                        className="p-0.5 text-[#1A1A1A] hover:text-[#B84A0E]"
                      >
                        {c.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-600" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{c.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, c.quantity + 1)}
                        className="p-0.5 text-[#1A1A1A] hover:text-[#B84A0E]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Contact Details */}
              <div className="pt-2 space-y-3 border-t border-[#DED9CF]">
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">Guest Info</h4>
                
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                />

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (for Order SMS) *"
                  className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                />

                {orderType === 'delivery' && (
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery Street Address *"
                    className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                  />
                )}
              </div>

              {/* Tip Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">Add Gratuity Tip</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 18, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-1.5 text-xs font-bold border transition-all ${
                        tipPercent === pct
                          ? 'bg-[#B84A0E] border-[#B84A0E] text-[#F4F1EA]'
                          : 'bg-[#F4F1EA] border-[#DED9CF] text-[#1A1A1A] hover:border-[#B84A0E]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Cart Footer Total & Checkout Action */}
          {!placedOrderCode && cart.length > 0 && (
            <div className="p-5 bg-[#F4F1EA] border-t border-[#DED9CF] space-y-3">
              <div className="space-y-1 text-xs text-[#666157]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8.5%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Gratuity Tip ({tipPercent}%):</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#DED9CF] flex justify-between items-center text-sm font-serif font-bold text-[#1A1A1A]">
                  <span className="uppercase tracking-wider text-[10px]">Total Amount:</span>
                  <span className="text-xl text-[#B84A0E]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E] transition-all flex items-center justify-center gap-2"
              >
                <span>Place Order (${total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
