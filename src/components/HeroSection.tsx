import React from 'react';
import { Calendar } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface HeroSectionProps {
  isDark: boolean;
  guestName?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isDark, guestName }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const greetingName = guestName?.trim() || 'Tamu Spesial';
  const brideInitial = weddingData.couple.bride.firstName.charAt(0).toUpperCase();
  const groomInitial = weddingData.couple.groom.firstName.charAt(0).toUpperCase();
  const initials = `${brideInitial} & ${groomInitial}`;
  const weddingDateText = new Date(weddingData.events.ceremony.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleScrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home"
      ref={ref}
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-maroon-50 via-maroon-25 to-maroon-100'
      }`}
      style={{
        backgroundImage: isDark ? 'none' : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 ${
          isDark ? 'bg-maroon-500' : 'bg-maroon-200'
        } animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-20 ${
          isDark ? 'bg-maroon-500' : 'bg-maroon-200'
        } animate-pulse delay-1000`}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className={`transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Intro Card */}
          <div className="flex justify-center mb-10">
            <div className={`relative w-full max-w-md mx-auto p-6 rounded-3xl shadow-2xl ${
              isDark 
                ? 'bg-gray-800/90 border border-gray-700' 
                : 'bg-white/95 border border-maroon-100'
            }`}>
              <p className={`text-sm font-semibold tracking-widest uppercase text-center ${
                isDark ? 'text-gray-300' : 'text-maroon-600'
              }`}>
                The Wedding of
              </p>

              <div className="mt-6 mb-4 flex justify-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-maroon-100 bg-gradient-to-br from-maroon-100 to-white flex items-center justify-center shadow-inner">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-300 flex items-center justify-center text-3xl font-serif text-white">
                    {initials}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h1 className={`text-3xl md:text-4xl font-serif ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {weddingData.couple.bride.firstName}
                </h1>
                <span className={`block text-xl ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>&</span>
                <h1 className={`text-3xl md:text-4xl font-serif ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {weddingData.couple.groom.firstName}
                </h1>
              </div>

              <p className={`mt-4 text-center text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Kami mengundang Anda untuk merayakan hari pernikahan kami.
              </p>

              <div className="mt-4 flex items-center justify-center space-x-2 text-maroon-600">
                <Calendar size={18} />
                <span className="text-sm font-medium">
                  {weddingDateText}
                </span>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleScrollToEvents}
                  className="px-5 py-3 rounded-full bg-maroon-500 text-white text-sm font-medium shadow-lg transition duration-300 hover:bg-maroon-600 hover:shadow-xl active:scale-95"
                >
                  Save the Date
                </button>
              </div>

              {/* {greetingName && (
                <div className="mt-6 flex justify-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isDark 
                      ? 'bg-gray-900 text-gray-100 border border-gray-700' 
                      : 'bg-white text-gray-800 border border-maroon-200'
                  }`}>
                    Untuk: {greetingName}
                  </span>
                </div>
              )} */}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16">
            <div className={`animate-bounce ${isDark ? 'text-gray-400' : 'text-maroon-400'}`}>
              <div className="w-6 h-10 border-2 border-current rounded-full mx-auto">
                <div className="w-1 h-3 bg-current rounded-full mx-auto mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};