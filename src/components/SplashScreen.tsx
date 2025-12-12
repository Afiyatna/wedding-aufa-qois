import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const phases = [
      { delay: 0, duration: 1000 }, // Names appear
      { delay: 0, duration: 1000 }, // Heart animation
      { delay: 0, duration: 500 }   // Fade out
    ];

    const timer = setTimeout(() => {
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(currentPhase + 1);
      } else {
        onComplete();
      }
    }, phases[currentPhase].delay);

    return () => clearTimeout(timer);
  }, [currentPhase, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200 flex items-center justify-center z-50 transition-opacity duration-1000">
      <div className="text-center space-y-8">
        {/* Couple Names */}
        <div className={`transition-all duration-1000 ${currentPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-6xl font-serif text-rose-800 mb-2">
            {weddingData.couple.bride.firstName}
          </h1>
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-rose-300 w-16"></div>
            <Heart className={`mx-4 text-rose-500 transition-all duration-1000 ${currentPhase >= 1 ? 'scale-125 text-rose-600' : 'scale-100'}`} size={24} />
            <div className="h-px bg-rose-300 w-16"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-rose-800">
            {weddingData.couple.groom.firstName}
          </h1>
        </div>

        {/* Date */}
        <div className={`transition-all duration-1000 delay-500 ${currentPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xl md:text-2xl text-rose-600 font-light">
            {new Date(weddingData.events.ceremony.date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Loading animation */}
        <div className={`transition-all duration-500 ${currentPhase >= 2 ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};