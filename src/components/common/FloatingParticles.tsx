import React from 'react';
import { Heart } from 'lucide-react';

export const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Floating hearts - Reduced count for mobile performance */}
      {[...Array(6)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-rose-300/40 will-change-transform"
          size={80 + Math.random() * 24} // Varied sizes
          style={{
            left: `${Math.random() * 100}%`,
            animation: `floatUp ${15 + Math.random() * 15}s linear infinite`,
            animationDelay: `-${Math.random() * 20}s`,
            opacity: 0,
          }}
          fill="currentColor"
        />
      ))}

      {/* Shimmering orbs - Hidden on mobile to save GPU resources */}
      <div className="hidden sm:block absolute top-1/4 left-1/4 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(110vh) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-10vh) scale(1) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
