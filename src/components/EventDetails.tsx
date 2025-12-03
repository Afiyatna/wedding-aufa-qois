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
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const events = [weddingData.events.ceremony, weddingData.events.reception];

  return (
    <section 
      id="events"
      ref={ref}
      className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-50 to-pink-50'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className={`text-4xl md:text-5xl font-serif mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Wedding Events
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join us as we celebrate our special day
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
                  isDark ? 'text-rose-300' : 'text-rose-600'
                }`}>
                  {event.title}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className={`${isDark ? 'text-rose-400' : 'text-rose-500'}`} size={20} />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(event.date).toLocaleDateString('en-US', {
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