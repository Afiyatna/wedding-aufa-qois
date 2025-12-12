import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { SectionWrapper, AnimateIn } from './common/SectionWrapper';

interface HeroSectionProps {
  isDark: boolean;
  guestName?: string;
  backgroundImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isDark, guestName, backgroundImage }) => {
  const [imageError, setImageError] = useState(false);
  const brideInitial = weddingData.couple.bride.firstName.charAt(0).toUpperCase();
  const groomInitial = weddingData.couple.groom.firstName.charAt(0).toUpperCase();
  const initials = `${brideInitial} & ${groomInitial}`;
  const coupleImage = weddingData.coupleImage || '';
  const weddingDateText = new Date(weddingData.events.ceremony.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleScrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('story');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <SectionWrapper
      id="home"
      isDark={isDark}
      backgroundImage={backgroundImage}
    >
      {(shouldAnimate) => (
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 py-20 sm:py-0">
          <div className="flex justify-center mb-8 sm:mb-10 relative z-20">
            <AnimateIn shouldAnimate={shouldAnimate} from="bottom" delay={0}>
              <div className={`relative w-full max-w-md mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-700 hover:scale-[1.02] ${isDark
                ? 'bg-gray-800/90 border border-gray-700'
                : 'bg-white/95 border border-rose-100'
                } ${shouldAnimate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <p className={`text-xs sm:text-sm font-semibold tracking-widest uppercase text-center ${isDark ? 'text-gray-300' : 'text-rose-600'
                  }`}>
                  The Wedding of
                </p>

                <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 flex justify-center">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-rose-100 bg-gradient-to-br from-rose-100 to-white flex items-center justify-center shadow-inner group">
                    {coupleImage && !imageError ? (
                      <img
                        src={coupleImage}
                        alt={`${weddingData.couple.bride.firstName} & ${weddingData.couple.groom.firstName}`}
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-rose-500 to-rose-300 flex items-center justify-center text-2xl sm:text-3xl font-serif text-white">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center align-center">
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-serif ${isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                    {weddingData.couple.bride.firstName}
                  </h1>
                  <span className={`mx-2 pt-1 block text-2xl ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>&</span>
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-serif ${isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                    {weddingData.couple.groom.firstName}
                  </h1>
                </div>

                <p className={`mt-3 sm:mt-4 text-center text-xs sm:text-sm px-2 ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  Kami mengundang Anda <br /> untuk merayakan hari pernikahan kami.
                </p>

                <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-2 text-rose-600">
                  <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm font-medium">
                    {weddingDateText}
                  </span>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <button
                    onClick={handleScrollToEvents}
                    className="px-5 py-2.5 sm:py-3 rounded-full bg-rose-500 text-white text-xs sm:text-sm font-medium shadow-lg transition duration-300 hover:bg-rose-600 hover:shadow-xl active:scale-95 touch-manipulation relative overflow-hidden group"
                  >
                    <span className="relative z-10">Save the Date</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* Scroll Indicator */}
          <AnimateIn shouldAnimate={shouldAnimate} delay={800} className="mt-8 sm:mt-16">
            <button
              onClick={handleScrollDown}
              className={`animate-bounce ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-rose-400 hover:text-rose-500'} cursor-pointer transition-colors touch-manipulation`}
              aria-label="Scroll ke bawah"
            >
              <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-current rounded-full mx-auto">
                <div className="w-1 h-2 sm:h-3 bg-current rounded-full mx-auto mt-1.5 sm:mt-2 animate-pulse"></div>
              </div>
            </button>
          </AnimateIn>
        </div>
      )}
    </SectionWrapper>
  );
};