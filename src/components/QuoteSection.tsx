import React from 'react';
import { Quote } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface QuoteSectionProps {
  isDark: boolean;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ isDark }) => {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <section 
      id="story"
      ref={ref}
      className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Quote 
            className={`mx-auto mb-8 ${isDark ? 'text-maroon-400' : 'text-maroon-500'}`} 
            size={48}
          />
          
          <blockquote className={`text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed mb-8 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            "{weddingData.quote.text}"
          </blockquote>
          
          <cite className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            — {weddingData.quote.author}
          </cite>

          {/* Decorative elements */}
          <div className="mt-12 flex justify-center items-center space-x-4">
            <div className={`w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-maroon-200'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-maroon-400' : 'bg-maroon-400'}`}></div>
            <div className={`w-4 h-px ${isDark ? 'bg-gray-600' : 'bg-maroon-200'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-maroon-400' : 'bg-maroon-400'}`}></div>
            <div className={`w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-maroon-200'}`}></div>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'} text-base md:text-lg font-semibold`}>
              Assalamualaikum Wr. Wb.
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base leading-relaxed max-w-2xl mx-auto`}>
              Tanpa mengurangi rasa hormat. Kami mengundang Bapak/Ibu/Saudara/i serta Kerabat sekalian untuk menghadiri acara pernikahan kami:
            </p>
          </div>

          {/* Couple cards */}
          <div className="mt-12 space-y-10">
            {/* Bride */}
            <div className={`relative max-w-md mx-auto p-6 rounded-3xl shadow-xl ${
              isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/95 border border-maroon-100'
            }`}>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-28 h-28 rounded-full border-4 border-maroon-100 bg-gradient-to-br from-maroon-100 to-white flex items-center justify-center shadow-inner">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-300 flex items-center justify-center text-3xl font-serif text-white">
                    {weddingData.couple.bride.firstName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className={`text-2xl md:text-3xl font-serif ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {weddingData.couple.bride.fullName}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Putri dari {weddingData.couple.bride.parents}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full border border-maroon-200 flex items-center justify-center text-maroon-500">
                &
              </div>
            </div>

            {/* Groom */}
            <div className={`relative max-w-md mx-auto p-6 rounded-3xl shadow-xl ${
              isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/95 border border-maroon-100'
            }`}>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-28 h-28 rounded-full border-4 border-maroon-100 bg-gradient-to-br from-maroon-100 to-white flex items-center justify-center shadow-inner">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-300 flex items-center justify-center text-3xl font-serif text-white">
                    {weddingData.couple.groom.firstName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className={`text-2xl md:text-3xl font-serif ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {weddingData.couple.groom.fullName}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Putra dari {weddingData.couple.groom.parents}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};