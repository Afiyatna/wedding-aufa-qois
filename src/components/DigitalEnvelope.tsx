import React, { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface DigitalEnvelopeProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const DigitalEnvelope: React.FC<DigitalEnvelopeProps> = ({ isDark, backgroundImage }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Gagal menyalin nomor rekening', err);
    }
  };

  return (
    <section
      id="envelope"
      ref={ref}
      className={`min-h-screen flex items-center py-12 sm:py-20 snap-start ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-50 via-rose-25 to-rose-50'
        }`}
      style={backgroundImage ? {
        backgroundImage: `url('/images/background/${backgroundImage}.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="flex items-center justify-center mb-4 sm:mb-6 space-x-3">
            <Gift className={isDark ? 'text-rose-300' : 'text-rose-500'} size={28} />
            <h2
              className={`text-3xl sm:text-4xl font-serif ${isDark ? 'text-white' : 'text-gray-800'
                }`}
            >
              {weddingData.digitalEnvelope.title}
            </h2>
          </div>

          <p
            className={`max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
          >
            {weddingData.digitalEnvelope.subtitle}
          </p>

          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={`px-5 py-3 rounded-full text-sm font-medium shadow-lg transition-all duration-300 touch-manipulation ${isDark
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-rose-500 text-white hover:bg-rose-600'
                } ${isOpen ? 'scale-95' : 'scale-100'}`}
            >
              {isOpen ? 'Tutup Detail' : 'Klik di sini'}
            </button>
          </div>

          <div
            className={`mt-8 sm:mt-10 grid gap-4 sm:gap-6 max-w-2xl mx-auto transition-all duration-500 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              } overflow-hidden`}
          >
            {weddingData.digitalEnvelope.accounts.map((acc, idx) => (
              <div
                key={acc.bank + acc.number}
                className={`p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-rose-100'
                  }`}
              >
                <div className="text-left">
                  <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-rose-300' : 'text-rose-500'}`}>
                    {acc.bank}
                  </p>
                  <p className={`text-lg sm:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {acc.number}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    a.n {acc.name}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(acc.number, idx)}
                  className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation ${isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Disalin
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Salin
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


