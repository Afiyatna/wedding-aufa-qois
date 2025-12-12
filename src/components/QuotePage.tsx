import React from 'react';
import { Quote } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { SectionWrapper, AnimateIn } from './common/SectionWrapper';

interface QuotePageProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const QuotePage: React.FC<QuotePageProps> = ({ isDark, backgroundImage }) => {
  return (
    <SectionWrapper
      id="quote"
      isDark={isDark}
      backgroundImage={backgroundImage}
    >
      {(shouldAnimate) => (
        <div className="container mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Quote Icon */}
            <AnimateIn shouldAnimate={shouldAnimate} from="top" delay={100} className="mb-8 sm:mb-12 flex justify-center">
              <Quote
                className={`${isDark ? 'text-rose-400' : 'text-rose-500'}`}
                size={64}
              />
            </AnimateIn>

            {/* Quote Text */}
            <AnimateIn shouldAnimate={shouldAnimate} delay={300}>
              <blockquote className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed mb-6 sm:mb-8 px-4 ${isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                "{weddingData.quote.text}"
              </blockquote>
            </AnimateIn>

            {/* Attribution */}
            <AnimateIn shouldAnimate={shouldAnimate} delay={500}>
              <cite className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                — {weddingData.quote.author}
              </cite>
            </AnimateIn>

            {/* Decorative dots at bottom */}
            <AnimateIn shouldAnimate={shouldAnimate} from="bottom" delay={700} className="mt-12 sm:mt-16 flex justify-center items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-500'}`}></div>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-500'}`}></div>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-rose-400' : 'bg-rose-500'}`}></div>
            </AnimateIn>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

