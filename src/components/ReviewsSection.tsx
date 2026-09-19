import React from 'react';
import { REVIEWS } from '../data/menuData';
import { Star, Quote, ThumbsUp, ShieldCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-14 bg-[#F4F1EA] text-[#1A1A1A] border-b border-[#DED9CF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 border-b border-[#DED9CF] pb-8">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#EBE7DF] border border-[#DED9CF] text-[#B84A0E] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Star className="w-3.5 h-3.5 fill-[#B84A0E]" />
            <span>Critique & Press • Rated Top Indian Cuisine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            What Our Guests Are Saying
          </h2>
          <p className="text-sm text-[#666157] font-serif italic">
            From local food connoisseurs to wedding hosts, discover why Tadka Kitchen is celebrated across the region.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] p-6 border border-[#DED9CF] flex flex-col justify-between"
            >
              <div>
                {/* Rating & Source Badge */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#DED9CF]">
                  <div className="flex items-center gap-1 text-[#B84A0E]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B84A0E]" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 bg-[#EBE7DF] text-[#666157] border border-[#DED9CF]">
                    via {rev.source}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-[#B84A0E]/30 mb-2" />
                <p className="text-sm text-[#1A1A1A] font-serif italic leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#DED9CF] flex items-center gap-3">
                {rev.avatar && (
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 object-cover border border-[#B84A0E]"
                  />
                )}
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">{rev.author}</h4>
                  {rev.dishRecommended && (
                    <p className="text-[10px] text-[#B84A0E] font-bold uppercase tracking-wider">
                      Recommends: {rev.dishRecommended}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
