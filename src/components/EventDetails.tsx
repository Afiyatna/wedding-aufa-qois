import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface EventDetailsProps {
  isDark: boolean;
  backgroundImage?: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ isDark, backgroundImage }) => {
  const { ref, shouldAnimate } = useIntersectionObserver();

  const formatTime = (time: string) => {
    const raw = time.trim();

    // If user already provides a range or includes WIB, show as-is (ensure WIB suffix once)
    if (raw.includes('-')) {
      const hasWib = raw.toLowerCase().includes('wib');
      return hasWib ? raw : `${raw} WIB`;
    }
    if (raw.toLowerCase().includes('wib')) {
      return raw;
    }

    // Default: parse single HH:mm to localized time with WIB suffix
    const [hours, minutes] = raw.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0);
    return `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })} WIB`;
  };

  const events = [weddingData.events.ceremony, weddingData.events.reception];

  return (
    <section
      id="events"
      ref={ref}
      className={`min-h-screen flex items-center py-12 sm:py-20 snap-start ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-50 to-rose-50'}`}
      style={backgroundImage ? {
        backgroundImage: `url('/images/background/${backgroundImage}.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-1000 ease-out ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-800'
            }`}>
            Rangkaian Acara
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Hadirilah momen spesial kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <div
              key={event.title}
              className={`transition-all duration-1000 ease-out delay-${index * 200} ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <div className={`p-5 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg h-full ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                }`}>
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-serif mb-4 sm:mb-6 ${isDark ? 'text-rose-300' : 'text-rose-600'
                  }`}>
                  {event.title}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className={`${isDark ? 'text-rose-400' : 'text-rose-500'}`} size={20} />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(event.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className={`${isDark ? 'text-rose-400' : 'text-rose-500'}`} size={20} />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatTime(event.time)}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className={`${isDark ? 'text-rose-400' : 'text-rose-500'} mt-1`} size={20} />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {event.venue}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-4 sm:mt-6">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={event.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};