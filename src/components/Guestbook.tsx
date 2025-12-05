import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Heart } from 'lucide-react';
import { supabase, GuestbookMessage } from '../lib/supabase';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface GuestbookProps {
  isDark: boolean;
}

export const Guestbook: React.FC<GuestbookProps> = ({ isDark }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [newMessage, setNewMessage] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('guestbook_messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [data, ...prev]);
      setNewMessage({ name: '', message: '' });
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section 
      id="guestbook"
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
            Buku Tamu
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Tinggalkan doa dan ucapan untuk kami
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Message Form */}
          <div className={`mb-12 transition-all duration-1000 delay-200 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <form 
              onSubmit={handleSubmit}
              className={`p-6 rounded-2xl shadow-lg ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <input
                    type="text"
                    value={newMessage.name}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama Anda"
                    required
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tulis pesan Anda..."
                    required
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  ></textarea>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !newMessage.name.trim() || !newMessage.message.trim()}
                    className="w-full bg-gradient-to-r from-maroon-500 to-maroon-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:from-maroon-600 hover:to-maroon-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Send size={16} />
                        <span className="hidden md:inline">Kirim</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Messages List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-maroon-500 border-t-transparent mx-auto"></div>
                <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Memuat pesan...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className={`text-center py-12 ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              } rounded-2xl shadow-lg`}>
                <MessageCircle className={`mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} size={48} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Jadilah yang pertama meninggalkan pesan!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`transition-all duration-1000 delay-${Math.min(index * 100, 800)} ${
                    hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className={`p-6 rounded-2xl shadow-lg ${
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-maroon-500' : 'bg-maroon-100'
                        }`}>
                          <span className={`font-medium ${
                            isDark ? 'text-white' : 'text-maroon-600'
                          }`}>
                            {msg.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {msg.name}
                          </h4>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {msg.created_at && formatDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                      <Heart className={`${isDark ? 'text-maroon-400' : 'text-maroon-500'}`} size={20} />
                    </div>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};