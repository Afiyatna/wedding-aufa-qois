import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { weddingData } from '../data/weddingData';
import { SectionWrapper, AnimateIn } from './common/SectionWrapper';

interface CountdownProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ isDark, backgroundImage }) => {
  const timeLeft = useCountdown(`${weddingData.events.ceremony.date}T${weddingData.events.ceremony.time}`);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

  return (
    <SectionWrapper
      id="countdown"
      isDark={isDark}
      backgroundImage={backgroundImage}
    >
      {(shouldAnimate) => (
        <div className="container mx-auto px-4 sm:px-6 w-full">
          <AnimateIn shouldAnimate={shouldAnimate} from="top" delay={100} className="text-center mb-10 sm:mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4 italic ${isDark ? 'text-white' : 'text-gray-800'
              }`}>
              Hitung Mundur
            </h2>
            <p className={`text-base italic sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Menuju hari bahagia kami
            </p>
          </AnimateIn>

          <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto">
            {timeUnits.map((unit, index) => (
              <AnimateIn
                key={unit.label}
                shouldAnimate={shouldAnimate}
                from="bottom"
                delay={300 + (index * 100)}
                className="text-center"
              >
                <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                  <div className={`text-[44px] font-bold mb-1 sm:mb-2 ${isDark ? 'text-rose-300' : 'text-rose-600'
                    }`}>
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div className={`text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {unit.label}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Special message when countdown reaches zero */}
          {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
            <AnimateIn shouldAnimate={shouldAnimate} delay={800} className={`text-center mt-12 p-8 rounded-2xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white/80 backdrop-blur-sm'
              }`}>
              <h3 className={`text-3xl md:text-4xl font-serif ${isDark ? 'text-rose-300' : 'text-rose-600'
                }`}>
                Hari ini waktunya! 🎉
              </h3>
              <p className={`mt-4 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Mari rayakan hari pernikahan kami!
              </p>
            </AnimateIn>
          )}
        </div>
      )}
    </SectionWrapper>
  );
};