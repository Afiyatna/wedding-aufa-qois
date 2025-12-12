import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { weddingData } from '../data/weddingData';

interface CountdownProps {
  isDark: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ isDark }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();
  const timeLeft = useCountdown(`${weddingData.events.ceremony.date}T${weddingData.events.ceremony.time}`);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

  return (
    <section
      ref={ref}
      className={`min-h-screen flex items-center py-12 sm:py-20 snap-start ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-1000 ease-out ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-800'
            }`}>
            Hitung Mundur
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Menuju hari bahagia kami
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {timeUnits.map((unit, index) => (
            <div
              key={unit.label}
              className={`text-center transition-all duration-1000 ease-out delay-${index * 100} ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white/80 backdrop-blur-sm'
                }`}>
                <div className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-1 sm:mb-2 ${isDark ? 'text-rose-300' : 'text-rose-600'
                  }`}>
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className={`text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {unit.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special message when countdown reaches zero */}
        {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
          <div className={`text-center mt-12 p-8 rounded-2xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white/80 backdrop-blur-sm'
            }`}>
            <h3 className={`text-3xl md:text-4xl font-serif ${isDark ? 'text-rose-300' : 'text-rose-600'
              }`}>
              Hari ini waktunya! 🎉
            </h3>
            <p className={`mt-4 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Mari rayakan hari pernikahan kami!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};