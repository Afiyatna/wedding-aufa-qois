import React from 'react';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface FooterProps {
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark }) => {
  return (
    <footer className={`py-12 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Couple Names */}
          <div className="mb-6">
            <h3 className={`text-2xl md:text-3xl font-serif ${isDark ? 'text-white' : 'text-gray-800'
              }`}>
              {weddingData.couple.bride.firstName} & {weddingData.couple.groom.firstName}
            </h3>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {new Date(weddingData.events.ceremony.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="#"
              className={`p-3 rounded-full transition-colors ${isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-rose-500 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-500 hover:text-white'
                }`}
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className={`p-3 rounded-full transition-colors ${isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-rose-500 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-500 hover:text-white'
                }`}
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className={`p-3 rounded-full transition-colors ${isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-rose-500 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-500 hover:text-white'
                }`}
            >
              <Twitter size={20} />
            </a>
          </div>

          {/* Decorative Element */}
          <div className="flex items-center justify-center mb-6">
            <div className={`h-px w-20 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <Heart
              className={`mx-4 ${isDark ? 'text-rose-400' : 'text-rose-500'}`}
              size={20}
              fill="currentColor"
            />
            <div className={`h-px w-20 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>

          {/* Copyright */}
          <div className="space-y-2">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Dibuat dengan <Heart className="inline w-4 h-4 text-rose-500" fill="currentColor" /> untuk hari spesial kami
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} {weddingData.couple.bride.firstName} & {weddingData.couple.groom.firstName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};