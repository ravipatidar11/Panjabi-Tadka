import React, { useState } from 'react';
import { ReservationDetails } from '../types';
import { Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, Phone, Mail, Info } from 'lucide-react';

export const ReservationSection: React.FC = () => {
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('7:00 PM');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [seatingPreference, setSeatingPreference] = useState<'indoor' | 'patio' | 'booth' | 'private_dining'>('indoor');
  const [specialOccasion, setSpecialOccasion] = useState<string>('none');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationDetails | null>(null);

  const timeSlots = [
    '11:30 AM', '12:15 PM', '1:00 PM', '1:45 PM', 
    '5:30 PM', '6:15 PM', '7:00 PM', '7:45 PM', '8:30 PM', '9:15 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert('Please fill in your name, phone number, and email.');
      return;
    }

    const resCode = 'PT-' + Math.floor(100000 + Math.random() * 900000);

    const reservation: ReservationDetails = {
      id: resCode,
      date,
      time,
      guests,
      name,
      email,
      phone,
      seatingPreference,
      specialOccasion: specialOccasion !== 'none' ? specialOccasion : undefined,
      specialNotes: specialNotes || undefined
    };

    setConfirmedReservation(reservation);
  };

  return (
    <section className="py-12 bg-[#1A1A1A] text-[#F4F1EA] border-b border-[#38342E]" id="reservation-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 border-b border-[#38342E] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2A2824] border border-[#38342E] text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Table Reservation • Gazette Gazette Booking</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F1EA]">
            Reserve Your Dining Experience
          </h2>
          <p className="text-sm text-[#C8C2B6] font-serif italic">
            Join us for authentic Punjabi hospitality. Instant confirmation sent via SMS & Email.
          </p>
        </div>

        {/* Confirmation Modal */}
        {confirmedReservation ? (
          <div className="max-w-xl mx-auto bg-[#2A2824] p-8 border border-[#524C42] text-center shadow-2xl">
            <div className="w-14 h-14 bg-emerald-950/80 text-emerald-400 border border-emerald-700 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B84A0E]">
              Reservation Confirmed
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#F4F1EA] mt-1">
              We look forward to hosting you, {confirmedReservation.name}!
            </h3>

            <div className="my-6 p-4 bg-[#1A1A1A] border border-[#38342E] text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#38342E] pb-2">
                <span className="text-[#A39D90] uppercase tracking-wider font-semibold">Confirmation Code:</span>
                <span className="font-mono font-bold text-[#B84A0E]">{confirmedReservation.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#38342E] pb-2">
                <span className="text-[#A39D90] uppercase tracking-wider font-semibold">Date & Time:</span>
                <span className="font-serif font-bold text-[#F4F1EA]">{confirmedReservation.date} at {confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between border-b border-[#38342E] pb-2">
                <span className="text-[#A39D90] uppercase tracking-wider font-semibold">Party Size:</span>
                <span className="font-bold text-[#F4F1EA]">{confirmedReservation.guests} Guest(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A39D90] uppercase tracking-wider font-semibold">Seating Area:</span>
                <span className="font-bold text-[#F4F1EA] capitalize">{confirmedReservation.seatingPreference.replace('_', ' ')}</span>
              </div>
            </div>

            <p className="text-xs text-[#A39D90] mb-6">
              A confirmation text has been sent to {confirmedReservation.phone}. Need to modify or cancel? Call us at (408) 555-0199.
            </p>

            <button
              onClick={() => setConfirmedReservation(null)}
              className="w-full py-3 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E]"
            >
              Make Another Reservation
            </button>
          </div>
        ) : (
          /* Main Reservation Form */
          <div className="max-w-4xl mx-auto bg-[#2A2824] p-6 sm:p-8 border border-[#524C42]">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Top Step 1: Party Size, Date, Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Party Size */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8C2B6] mb-2 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#B84A0E]" />
                    Party Size
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs font-medium focus:outline-hidden focus:border-[#B84A0E]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                    <option value={15}>15+ Large Group (Private Dining)</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8C2B6] mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B84A0E]" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs font-medium focus:outline-hidden focus:border-[#B84A0E]"
                  />
                </div>

                {/* Preferred Seating Area */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8C2B6] mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B84A0E]" />
                    Seating Area
                  </label>
                  <select
                    value={seatingPreference}
                    onChange={(e) => setSeatingPreference(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs font-medium focus:outline-hidden focus:border-[#B84A0E]"
                  >
                    <option value="indoor">Main Dining Hall</option>
                    <option value="patio">Outdoor Heritage Patio</option>
                    <option value="booth">Cozy Booth</option>
                    <option value="private_dining">Private Maharaja Lounge</option>
                  </select>
                </div>

              </div>

              {/* Step 2: Time Slot Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8C2B6] mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B84A0E]" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 px-3 text-xs font-bold transition-all border ${
                        time === slot
                          ? 'bg-[#B84A0E] border-[#B84A0E] text-[#F4F1EA]'
                          : 'bg-[#1A1A1A] border-[#524C42] text-[#C8C2B6] hover:border-[#B84A0E]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Guest Contact Details */}
              <div className="pt-4 border-t border-[#38342E] space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#F4F1EA]">Guest Contact Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C8C2B6] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jaspreet Kaur"
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C8C2B6] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(408) 555-0199"
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C8C2B6] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jaspreet@example.com"
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C8C2B6] mb-1">Special Occasion</label>
                    <select
                      value={specialOccasion}
                      onChange={(e) => setSpecialOccasion(e.target.value)}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs focus:outline-hidden focus:border-[#B84A0E]"
                    >
                      <option value="none">Casual Dining</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="family_get_together">Family Get Together</option>
                      <option value="business">Business Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C8C2B6] mb-1">Dietary or Seating Requests</label>
                    <input
                      type="text"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. High chair needed, quiet table, peanut allergy"
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#524C42] text-[#F4F1EA] text-xs focus:outline-hidden focus:border-[#B84A0E]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#B84A0E] hover:bg-[#9B3C09] text-[#F4F1EA] font-bold text-xs uppercase tracking-widest border border-[#B84A0E] transition-all"
                >
                  Confirm Table Reservation
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
