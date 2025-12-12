import React, { useState } from 'react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface QuoteSectionProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ isDark, backgroundImage }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();
  const [brideImageError, setBrideImageError] = useState(false);
  const [groomImageError, setGroomImageError] = useState(false);

  return (
    <section 
      id="story"
      ref={ref}
      className={`min-h-screen flex items-center py-12 sm:py-20 snap-start ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200'}`}
      style={backgroundImage ? {
        backgroundImage: `url('/images/background/${backgroundImage}.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
          shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Decorative elements */}
          <div className="mb-8 sm:mb-12 flex justify-center items-center space-x-3 sm:space-x-4">
            <div className={`w-12 sm:w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-rose-200'}`}></div>
            <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-400'}`}></div>
            <div className={`w-3 sm:w-4 h-px ${isDark ? 'bg-gray-600' : 'bg-rose-200'}`}></div>
            <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-400'}`}></div>
            <div className={`w-12 sm:w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-rose-200'}`}></div>
          </div>

          <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3 text-center">
            <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'} text-sm sm:text-base md:text-lg font-semibold px-4`}>
              Assalamualaikum Wr. Wb.
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto px-4`}>
              Tanpa mengurangi rasa hormat. Kami mengundang Bapak/Ibu/Saudara/i serta Kerabat sekalian untuk menghadiri acara pernikahan kami:
            </p>
          </div>

          {/* Couple cards */}
          <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-10">
            {/* Bride */}
            <div className={`relative max-w-md mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl ${
              isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/95 border border-rose-100'
            }`}>
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-rose-100 bg-gradient-to-br from-rose-100 to-white flex items-center justify-center shadow-inner overflow-hidden">
                  {weddingData.couple.bride.image && !brideImageError ? (
                    <img 
                      src={weddingData.couple.bride.image} 
                      alt={weddingData.couple.bride.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      onError={() => setBrideImageError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-500 to-rose-300 flex items-center justify-center text-2xl sm:text-3xl font-serif text-white">
                      {weddingData.couple.bride.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-serif px-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {weddingData.couple.bride.fullName}
                </h3>
                <p className={`text-xs sm:text-sm px-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Putri dari {weddingData.couple.bride.parents}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="flex justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-rose-200 flex items-center justify-center text-rose-500 text-sm sm:text-base">
                &
              </div>
            </div>

            {/* Groom */}
            <div className={`relative max-w-md mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl ${
              isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/95 border border-rose-100'
            }`}>
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-rose-100 bg-gradient-to-br from-rose-100 to-white flex items-center justify-center shadow-inner overflow-hidden">
                  {weddingData.couple.groom.image && !groomImageError ? (
                    <img 
                      src={weddingData.couple.groom.image} 
                      alt={weddingData.couple.groom.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      onError={() => setGroomImageError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-500 to-rose-300 flex items-center justify-center text-2xl sm:text-3xl font-serif text-white">
                      {weddingData.couple.groom.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-serif px-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {weddingData.couple.groom.fullName}
                </h3>
                <p className={`text-xs sm:text-sm px-2 ${
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
