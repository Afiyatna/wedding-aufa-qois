import React, { useState } from 'react';
import { Mail, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { FloatingParticles } from './common/FloatingParticles';

interface InvitationLandingProps {
  guestName: string;
  onOpenInvitation: () => void;
  backgroundImage?: string;
}

export const InvitationLanding: React.FC<InvitationLandingProps> = ({
  guestName,
  onOpenInvitation,
  backgroundImage
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  React.useEffect(() => {
    // Trigger entry animations
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleOpenInvitation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onOpenInvitation();
    }, 800);
  };

  return (
    <div className={`max-w-[450px] mx-auto min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${isAnimating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`} style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #f9a8d4 75%, #f472b6 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite'
      }}>
      {/* Background Image with Slow Zoom (Ken Burns Effect) */}
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/background/${backgroundImage}.jpeg')`,
              animation: 'kenBurns 8s ease-in-out infinite alternate'
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0"></div>
        </div>
      )}

      {/* Global Floating Particles */}
      <FloatingParticles />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-md mx-auto">
        {/* Envelope icon */}
        <div className={`mb-8 transition-all duration-1000 delay-100 transform ${showContent ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 rounded-full shadow-lg animate-bounce relative">
            <Mail className="text-rose-500 relative z-10" size={32} />
            <div className="absolute inset-0 bg-rose-200/50 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Invitation text */}
        <div className={`bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 transition-all duration-1000 delay-300 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="mb-6">
            <p className="text-rose-600 text-sm font-medium uppercase tracking-wider mb-2">
              Undangan
            </p>
            <h1 className="text-3xl font-serif text-gray-800 mb-4">
              {weddingData.couple.bride.firstName} & {weddingData.couple.groom.firstName}
            </h1>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-rose-300 w-16"></div>
            <Heart className="mx-4 text-rose-500 animate-pulse" size={16} fill="currentColor" />
            <div className="h-px bg-rose-300 w-16"></div>
          </div>

          {/* Personal greeting */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Kepada Bapak/Ibu/Saudara/i</p>
            <p className="text-2xl font-serif text-gray-800 mb-4">{guestName}</p>
            {/* <p className="text-gray-600 text-sm leading-relaxed">
              Dengan penuh sukacita, kami mengundang Anda untuk hadir di hari pernikahan kami.
              Kehadiran Anda akan membuat hari spesial ini semakin berarti.
            </p> */}
          </div>

          {/* Wedding date */}
          {/* <div className="flex items-center justify-center mb-8 text-rose-600">
            <Calendar size={16} />
            <span className="ml-2 text-sm font-medium">
              {new Date(weddingData.events.ceremony.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div> */}

          {/* Open invitation button */}
          <button
            onClick={handleOpenInvitation}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-2xl font-medium text-md transition-all duration-300 hover:from-rose-600 hover:to-rose-700 hover:shadow-xl hover:scale-105 active:scale-95 relative overflow-hidden group"
          >
            <span className="relative z-10">Buka Undangan</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>

        {/* Bottom text */}
        <p className={`mt-6 text-white/90 text-xs font-medium tracking-wide shadow-black/50 drop-shadow-md transition-all duration-1000 delay-700 transform ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          Dengan hormat dan kasih
        </p>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};