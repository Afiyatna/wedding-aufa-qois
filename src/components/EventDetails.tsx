import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface EventDetailsProps {
  isDark: boolean;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ isDark }) => {
  const { ref, hasIntersected } = useIntersectionObserver();

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
      className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-maroon-50 to-maroon-50'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className={`text-4xl md:text-5xl font-serif mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Rangkaian Acara
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Hadirilah momen spesial kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <div
              key={event.title}
              className={`transition-all duration-1000 delay-${index * 200} ${
                hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className={`p-8 rounded-2xl shadow-lg h-full ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
                <h3 className={`text-2xl md:text-3xl font-serif mb-6 ${
                  isDark ? 'text-maroon-300' : 'text-maroon-600'
                }`}>
                  {event.title}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className={`${isDark ? 'text-maroon-400' : 'text-maroon-500'}`} size={20} />
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
                    <Clock className={`${isDark ? 'text-maroon-400' : 'text-maroon-500'}`} size={20} />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatTime(event.time)}
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className={`${isDark ? 'text-maroon-400' : 'text-maroon-500'} mt-1`} size={20} />
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
                <div className="mt-6">
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