import React from 'react';
import { Quote } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface QuotePageProps {
  isDark: boolean;
}

export const QuotePage: React.FC<QuotePageProps> = ({ isDark }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();

  return (
    <section 
      id="quote"
      ref={ref}
      className={`min-h-screen flex items-center justify-center py-12 sm:py-20 snap-start ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ease-out ${
          shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Quote Icon */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <Quote 
              className={`${isDark ? 'text-maroon-400' : 'text-maroon-500'}`} 
              size={64}
            />
          </div>
          
          {/* Quote Text */}
          <blockquote className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed mb-6 sm:mb-8 px-4 ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>
            "{weddingData.quote.text}"
          </blockquote>
          
          {/* Attribution */}
          <cite className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            — {weddingData.quote.author}
          </cite>

          {/* Decorative dots at bottom */}
          <div className="mt-12 sm:mt-16 flex justify-center items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-maroon-400' : 'bg-maroon-500'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-maroon-400' : 'bg-maroon-500'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-maroon-400' : 'bg-maroon-500'}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

