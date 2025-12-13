import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface GalleryProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ isDark, backgroundImage }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);



  return (
    <section
      id="gallery"
      ref={ref}
      className={`min-h-screen flex items-center py-12 sm:py-20 snap-start ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200'}`}
      style={backgroundImage ? {
        backgroundImage: `url('/images/background/${backgroundImage}.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-1000 ease-out ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4 italic ${isDark ? 'text-white' : 'text-gray-800'
            }`}>
            Galeri Kami
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Tidak ada yang spesial dalam cerita kami.<br />
            Tapi kami sangat spesial untuk satu sama lain.<br />
            Dan Kami bersyukur, dipertemukan Allah<br />
            diwaktu terbaik, kini kami menanti hari istimewa kami.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 max-w-6xl mx-auto">
          {weddingData.gallery.map((photo, index) => {
            const isFullWidth = index === 0 || index === weddingData.gallery.length - 1;

            return (
              <div
                key={photo.id}
                className={`relative group cursor-pointer transition-all duration-1000 ease-out delay-${index * 100} ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${isFullWidth ? 'col-span-2' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className={`${isFullWidth ? 'aspect-video' : 'aspect-square'} overflow-hidden rounded-lg`}>
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Lihat ukuran penuh</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <Content
          images={weddingData.gallery}
          initialIndex={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
};

const Content = ({ images, initialIndex, onClose }: { images: typeof weddingData.gallery, initialIndex: number, onClose: () => void }) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0"
      onClick={() => setShowControls(prev => !prev)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
      ref={input => input && input.focus()}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt}
          className="max-w-full max-h-full object-contain"
          onClick={() => {
            // Allow clicking image to toggle controls
          }}
        />

        {/* Controls Overlay - Conditional Visibility */}
        <div className={`transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Close button - Top Right of Viewport */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="fixed top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-50"
          >
            <X size={24} />
          </button>

          {/* Navigation buttons - Viewport Edges */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="fixed left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-50"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-50"
          >
            <ChevronRight size={28} />
          </button>

          {/* Image counter - Bottom Center of Viewport */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium z-50">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};