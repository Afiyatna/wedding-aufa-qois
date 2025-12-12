import React, { useState } from 'react';
import { Gift, Copy, Check, CopyIcon, File, Files } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { SectionWrapper, AnimateIn } from './common/SectionWrapper';

interface DigitalEnvelopeProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const DigitalEnvelope: React.FC<DigitalEnvelopeProps> = ({ isDark, backgroundImage }) => {
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
    <SectionWrapper
      id="envelope"
      isDark={isDark}
      backgroundImage={backgroundImage}
    >
      {(shouldAnimate) => (
        <div className="container mx-auto px-4 sm:px-6 w-full">
          <div
            className={`max-w-4xl mx-auto text-center`}
          >
            <AnimateIn shouldAnimate={shouldAnimate} from="top" delay={100} className="flex items-center justify-center mb-4 sm:mb-6 space-x-3">
              <Gift className={isDark ? 'text-rose-300' : 'text-rose-500'} size={28} />
              <h2
                className={`text-3xl sm:text-4xl font-serif italic ${isDark ? 'text-white' : 'text-gray-800'
                  }`}
              >
                {weddingData.digitalEnvelope.title}
              </h2>
            </AnimateIn>

            <AnimateIn shouldAnimate={shouldAnimate} delay={300}>
              <p
                className={`max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                {weddingData.digitalEnvelope.subtitle}
              </p>
            </AnimateIn>

            <AnimateIn shouldAnimate={shouldAnimate} delay={500} className="mt-8 sm:mt-10 flex justify-center">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`px-5 py-3 rounded-full text-sm font-medium shadow-lg transition-all duration-1000 touch-manipulation ${isDark
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
                  } ${isOpen ? 'scale-95' : 'scale-100'}`}
              >
                <span className="flex items-center gap-2">
                  <Gift size={18} className="text-white" />
                  {isOpen ? 'Tutup Detail' : 'Klik di sini'}
                </span>
              </button>
            </AnimateIn>

            <div
              className={`mt-8 mx-10 grid gap-4 transition-all duration-1000 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                } overflow-hidden`}
            >
              {weddingData.digitalEnvelope.accounts.map((acc, idx) => (
                <div
                  key={acc.bank + acc.number}
                  className={`relative px-5 py-4 rounded-3xl shadow-xl overflow-hidden group ${isDark
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                    : 'bg-white border border-gray-100'
                    }`}
                   style={{
                        backgroundImage: "url('https://hi.wekita.in/wp-content/uploads/2025/04/bg-bank-1.webp')",
                        backgroundPosition: "bottom right",
                        backgroundSize: "cover"
                  }}
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    {/* Bank Logo */}
                    <div className="flex justify-end">
                      <img
                        src={acc.image}
                        alt={acc.bank}
                        width={90}
                        className="object-contain"
                      />
                    </div>

                    <div className="text-left">
                      <img src="/images/logo/chip.png" alt="chip" className="h-6 object-contain"/>
                      <p className={`text-xs tracking-wider uppercase font-medium my-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {acc.number}
                      </p>
                      <p className={`text-xs tracking-wider uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {acc.name}
                      </p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleCopy(acc.number, idx)}
                        className={`inline-flex items-center p-2 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 bg-gray-400 text-white hover:bg-gray-600`}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={12} className="mr-2" />
                            Disalin
                          </>
                        ) : (
                          <>
                            <Copy size={12} className="mr-2" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Special Gift Card */}
              {weddingData.digitalEnvelope.gift && (
                <div
                  className={`relative p-6 rounded-3xl shadow-xl overflow-hidden text-center group ${isDark
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                    : 'bg-white border border-gray-100'
                    }`}
                   style={{
                        backgroundImage: "url('https://hi.wekita.in/wp-content/uploads/2025/04/bg-bank-1.webp')",
                        backgroundPosition: "bottom right",
                        backgroundSize: "cover"
                  }}
                >
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-rose-500/20 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>
                      <Gift size={20} />
                    </div>

                    <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Kirim Hadiah
                    </h3>

                    <div className="mt-3">
                      <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Nama Penerima : {weddingData.digitalEnvelope.gift.name}
                      </p>
                      <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        No. HP : {weddingData.digitalEnvelope.gift.handphone}
                      </p>
                      <p className={`text-xs leading-relaxed max-w-xs mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Alamat : {weddingData.digitalEnvelope.gift.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};


