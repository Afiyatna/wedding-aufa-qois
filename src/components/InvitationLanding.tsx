import React, { useState } from 'react';
import { Heart, Mail, Calendar } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface InvitationLandingProps {
  guestName: string;
  onOpenInvitation: () => void;
}

export const InvitationLanding: React.FC<InvitationLandingProps> = ({ 
  guestName, 
  onOpenInvitation 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenInvitation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onOpenInvitation();
    }, 800);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
      isAnimating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
    }`} style={{
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 25%, #fca5a5 50%, #f87171 75%, #ef4444 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite'
    }}>
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-maroon-200/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-maroon-200/40 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/15 rounded-full animate-bounce delay-2000"></div>
        
        {/* Floating hearts */}
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-maroon-300/40 animate-pulse"
            size={16 + Math.random() * 16}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-md mx-auto">
        {/* Envelope icon */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 rounded-full shadow-lg">
            <Mail className="text-maroon-500" size={32} />
          </div>
        </div>

        {/* Invitation text */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="mb-6">
          <p className="text-maroon-600 text-sm font-medium uppercase tracking-wider mb-2">
            Undangan Pernikahan
          </p>
            <h1 className="text-3xl font-serif text-gray-800 mb-4">
              {weddingData.couple.bride.firstName} & {weddingData.couple.groom.firstName}
            </h1>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-maroon-300 w-16"></div>
            <Heart className="mx-4 text-maroon-500" size={16} fill="currentColor" />
            <div className="h-px bg-maroon-300 w-16"></div>
          </div>

          {/* Personal greeting */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Kepada Yth.</p>
            <p className="text-2xl font-serif text-gray-800 mb-4">{guestName}</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dengan penuh sukacita, kami mengundang Anda untuk hadir di hari pernikahan kami. 
              Kehadiran Anda akan membuat hari spesial ini semakin berarti.
            </p>
          </div>

          {/* Wedding date */}
          <div className="flex items-center justify-center mb-8 text-maroon-600">
            <Calendar size={16} />
            <span className="ml-2 text-sm font-medium">
              {new Date(weddingData.events.ceremony.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Open invitation button */}
          <button
            onClick={handleOpenInvitation}
            className="w-full bg-gradient-to-r from-maroon-500 to-maroon-500 text-white py-4 px-8 rounded-2xl font-medium text-lg transition-all duration-300 hover:from-maroon-600 hover:to-maroon-600 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Buka Undangan
          </button>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-maroon-700/80 text-xs">
          Dengan hormat dan kasih
        </p>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};