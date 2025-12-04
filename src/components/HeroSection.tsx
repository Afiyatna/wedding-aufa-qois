import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface HeroSectionProps {
  isDark: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isDark }) => {
  const { ref, hasIntersected } = useIntersectionObserver();

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
          {/* Pre-title */}
          <p className={`text-lg md:text-xl mb-8 ${
            isDark ? 'text-gray-300' : 'text-maroon-600'
          }`}>
            The Wedding of
          </p>

          {/* Couple Names */}
          <div className="space-y-6 mb-12">
            <div>
              <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif leading-tight ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {weddingData.couple.bride.fullName}
              </h1>
              <p className={`text-sm md:text-base mt-2 font-light ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Putri dari {weddingData.couple.bride.parents}
              </p>
            </div>
            
            <span className={`block text-4xl md:text-5xl lg:text-6xl ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              &
            </span>
            
            <div>
              <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif leading-tight ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {weddingData.couple.groom.fullName}
              </h1>
              <p className={`text-sm md:text-base mt-2 font-light ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Putra dari {weddingData.couple.groom.parents}
              </p>
            </div>
          </div>

          {/* Heart Decoration */}
          <div className="flex items-center justify-center mb-8">
            <div className={`h-px w-20 ${isDark ? 'bg-gray-600' : 'bg-maroon-300'}`}></div>
            <Heart 
              className={`mx-6 animate-pulse ${isDark ? 'text-maroon-400' : 'text-maroon-500'}`} 
              size={32} 
              fill="currentColor" 
            />
            <div className={`h-px w-20 ${isDark ? 'bg-gray-600' : 'bg-maroon-300'}`}></div>
          </div>

          {/* Wedding Date */}
          <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white/80 border border-maroon-200'
          } backdrop-blur-sm`}>
            <Calendar className={isDark ? 'text-maroon-400' : 'text-maroon-500'} size={20} />
            <span className={`text-lg font-medium ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {new Date(weddingData.events.ceremony.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
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