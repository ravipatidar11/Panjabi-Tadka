import React, { useState } from 'react';
import { CATERING_PACKAGES } from '../data/menuData';
import { CateringInquiry } from '../types';
import { Utensils, Check, Flame, Users, Calendar, Calculator, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { api } from '../services/api';

export const CateringSection: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('royal-maharaja');
  const [guestCount, setGuestCount] = useState<number>(50);
  const [liveTandoorOption, setLiveTandoorOption] = useState<boolean>(true);
  
  // Inquiry Form State
  const [eventType, setEventType] = useState<string>('Wedding Rehearsal');
  const [eventDate, setEventDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submittedInquiry, setSubmittedInquiry] = useState<CateringInquiry | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePkg = CATERING_PACKAGES.find((p) => p.id === selectedPackage) || CATERING_PACKAGES[0];
  const baseCost = activePkg.pricePerPerson * guestCount;
  const tandoorAddon = liveTandoorOption ? 29400 : 0;
  const totalEst = baseCost + tandoorAddon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !eventDate) {
      alert('Please fill in your contact information and event date.');
      return;
    }

    const inquiry: CateringInquiry = {
      eventType,
      guestCount,
      eventDate,
      packageType: activePkg.name,
      name,
      email,
      phone,
      budgetRange: `${formatINR(totalEst)} Estimated`,
      additionalNotes: notes
    };

    setSubmissionError(null);
    setIsSubmitting(true);
    try {
      await api.createCateringBooking(inquiry);
      setSubmittedInquiry(inquiry);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to submit the catering request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-[#F4F1EA] text-[#1A1A1A]" id="catering-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 border-b border-[#DED9CF] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBE7DF] border border-[#DED9CF] text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Utensils className="w-3.5 h-3.5" />
            <span>Royal Catering & Live Tandoor Stalls</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Punjabi Feast for Weddings & Celebrations
          </h2>
          <p className="text-sm sm:text-base text-[#666157] font-serif italic">
            "Elevate your celebrations with authentic Punjabi buffets, live clay tandoor stations, and hand-crafted mithai spreads."
          </p>
        </div>

        {/* Packages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {CATERING_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative bg-[#FAF8F5] p-6 border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#B84A0E] bg-[#EBE7DF]/50'
                    : 'border-[#DED9CF] hover:border-[#B84A0E]/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B84A0E] text-[#F4F1EA] px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] border border-[#B84A0E]">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">{pkg.name}</h3>
                  <p className="text-xs text-[#666157] font-serif italic mt-1 min-h-[32px]">{pkg.description}</p>

                  <div className="my-4 pt-3 border-t border-[#DED9CF]">
                    <span className="font-serif font-bold text-3xl text-[#B84A0E]">{formatINR(pkg.pricePerPerson)}</span>
                    <span className="text-xs text-[#666157] font-medium ml-1">/ person</span>
                    <div className="text-[10px] uppercase tracking-wider text-[#666157] mt-0.5">Min. {pkg.minGuests} guests</div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 mb-6">
                    {pkg.includes.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#38342E]">
                        <Check className="w-3.5 h-3.5 text-[#B84A0E] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full py-2.5 font-bold text-xs uppercase tracking-widest transition-all border ${
                    isSelected
                      ? 'bg-[#B84A0E] text-[#F4F1EA] border-[#B84A0E]'
                      : 'bg-[#F4F1EA] text-[#1A1A1A] border-[#DED9CF] hover:bg-[#EBE7DF]'
                  }`}
                >
                  {isSelected ? 'Selected Package ✓' : 'Select Package'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Estimator & Inquiry Form Box */}
        <div className="bg-[#FAF8F5] border border-[#DED9CF] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Estimator Panel */}
          <div className="lg:col-span-5 bg-[#1A1A1A] text-[#F4F1EA] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#38342E]">
            <div>
              <div className="flex items-center gap-2 text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                <Calculator className="w-3.5 h-3.5" />
                <span>Instant Budget Estimator</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#F4F1EA] mb-6">
                Calculate Event Estimate
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#C8C2B6] mb-2">
                    <span className="uppercase tracking-wider text-[10px]">Guest Count:</span>
                    <span className="text-[#B84A0E] font-serif text-sm font-bold">{guestCount} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="500"
                    step="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-[#B84A0E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#A39D90] mt-1">
                    <span>15 Guests</span>
                    <span>250</span>
                    <span>500+ Guests</span>
                  </div>
                </div>

                {/* Live Tandoor Addon Toggle */}
                <div className="p-4 bg-[#2A2824] border border-[#38342E]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={liveTandoorOption}
                      onChange={(e) => setLiveTandoorOption(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#B84A0E]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#F4F1EA] block flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#B84A0E] fill-[#B84A0E]" />
                        Include Live Clay Tandoor Chef Station
                      </span>
                      <span className="text-[11px] text-[#A39D90] font-serif italic block mt-0.5">
                        Chef cooks piping hot garlic naan & tandoori kebabs live on-site ({formatINR(29400)} setup fee).
                      </span>
                    </div>
                  </label>
                </div>

                {/* Estimate Breakdown */}
                <div className="p-4 bg-[#1A1A1A] border border-[#38342E] space-y-2 text-xs">
                  <div className="flex justify-between text-[#C8C2B6]">
                    <span>Package ({activePkg.name}):</span>
                    <span>{formatINR(activePkg.pricePerPerson)} × {guestCount} = {formatINR(baseCost)}</span>
                  </div>
                  {liveTandoorOption && (
                    <div className="flex justify-between text-[#C8C2B6]">
                      <span>Live Clay Tandoor Setup:</span>
                      <span>+{formatINR(29400)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#38342E] flex justify-between items-center font-bold text-sm text-[#F4F1EA]">
                    <span className="uppercase tracking-wider text-[10px]">Estimated Total:</span>
                    <span className="text-2xl font-serif font-bold text-[#B84A0E]">{formatINR(totalEst)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-[#A39D90] mt-6 leading-relaxed uppercase tracking-wider">
              * Final quote may vary depending on custom menu selections, service staff, and special dietary requests.
            </p>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#FAF8F5]">
            {submittedInquiry ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 border border-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Catering Request Received
                </h3>
                <p className="text-sm text-[#524C42] max-w-md mx-auto font-serif italic">
                  Thank you {submittedInquiry.name}! Our catering manager will contact you at <strong>{submittedInquiry.phone}</strong> within 2 hours with customized menu options and formal proposal.
                </p>
                <button
                  onClick={() => setSubmittedInquiry(null)}
                  className="px-6 py-2.5 bg-[#1A1A1A] text-[#F4F1EA] text-xs font-bold uppercase tracking-widest border border-[#1A1A1A]"
                >
                  Submit Another Event Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">
                  Request Official Catering Proposal
                </h3>
                <p className="text-xs text-[#666157] font-serif italic mb-4">
                  Fill out your event details below to lock in date availability.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Event Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                    >
                      <option value="Wedding / Anand Karaj">Wedding / Reception</option>
                      <option value="Corporate Event">Office Celebration / Gathering</option>
                      <option value="Birthday Celebration">Birthday / Anniversary</option>
                      <option value="Puja / Satsang">Satsang / Religious Gathering</option>
                      <option value="Housewarming">Housewarming Party</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Manpreet Singh"
                      className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(408) 555-0199"
                      className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manpreet@example.com"
                      className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Dietary Preferences & Special Requests</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 30% Vegetarian guests, need Jain options (no onion/garlic), live chaat station..."
                    className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#DED9CF] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#B84A0E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Request...' : `Submit Catering Inquiry (${formatINR(totalEst)} Est.)`}</span>
                </button>
                {submissionError && <p className="text-xs text-red-700" role="alert">{submissionError}</p>}
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
