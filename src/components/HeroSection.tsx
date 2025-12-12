import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface HeroSectionProps {
  isDark: boolean;
  guestName?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isDark, guestName }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();
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
    <section
      id="home"
      ref={ref}
      className={`min-h-screen flex items-center justify-center relative overflow-hidden snap-start ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-50 via-rose-25 to-rose-100'
        }`}
      style={{
        backgroundImage: isDark ? 'none' : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 ${isDark ? 'bg-rose-500' : 'bg-rose-200'
          } animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-20 ${isDark ? 'bg-rose-500' : 'bg-rose-200'
          } animate-pulse delay-1000`}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 py-20 sm:py-0">
        <div className={`transition-all duration-1000 ease-out ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          {/* Intro Card */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className={`relative w-full max-w-md mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl ${isDark
                ? 'bg-gray-800/90 border border-gray-700'
                : 'bg-white/95 border border-rose-100'
              }`}>
              <p className={`text-xs sm:text-sm font-semibold tracking-widest uppercase text-center ${isDark ? 'text-gray-300' : 'text-rose-600'
                }`}>
                The Wedding of
              </p>

              <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 flex justify-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-rose-100 bg-gradient-to-br from-rose-100 to-white flex items-center justify-center shadow-inner">
                  {coupleImage && !imageError ? (
                    <img
                      src={coupleImage}
                      alt={`${weddingData.couple.bride.firstName} & ${weddingData.couple.groom.firstName}`}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-rose-500 to-rose-300 flex items-center justify-center text-2xl sm:text-3xl font-serif text-white">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center space-y-1">
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-serif ${isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                  {weddingData.couple.bride.firstName}
                </h1>
                <span className={`block text-lg sm:text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>&</span>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-serif ${isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                  {weddingData.couple.groom.firstName}
                </h1>
              </div>

              <p className={`mt-3 sm:mt-4 text-center text-xs sm:text-sm px-2 ${isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Kami mengundang Anda untuk merayakan hari pernikahan kami.
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
                  className="px-5 py-2.5 sm:py-3 rounded-full bg-rose-500 text-white text-xs sm:text-sm font-medium shadow-lg transition duration-300 hover:bg-rose-600 hover:shadow-xl active:scale-95 touch-manipulation"
                >
                  Save the Date
                </button>
              </div>

              {/* {greetingName && (
                <div className="mt-6 flex justify-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isDark 
                      ? 'bg-gray-900 text-gray-100 border border-gray-700' 
                      : 'bg-white text-gray-800 border border-rose-200'
                  }`}>
                    Untuk: {greetingName}
                  </span>
                </div>
              )} */}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-8 sm:mt-16">
            <button
              onClick={handleScrollDown}
              className={`animate-bounce ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-rose-400 hover:text-rose-500'} cursor-pointer transition-colors touch-manipulation`}
              aria-label="Scroll ke bawah"
            >
              <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-current rounded-full mx-auto">
                <div className="w-1 h-2 sm:h-3 bg-current rounded-full mx-auto mt-1.5 sm:mt-2 animate-pulse"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};