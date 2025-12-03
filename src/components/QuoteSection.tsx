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
            className={`mx-auto mb-8 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} 
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
            <div className={`w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-rose-200'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-400'}`}></div>
            <div className={`w-4 h-px ${isDark ? 'bg-gray-600' : 'bg-rose-200'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-400'}`}></div>
            <div className={`w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-rose-200'}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};