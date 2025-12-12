import React, { useState, useEffect, useMemo } from 'react';
import { Send, CheckCircle, XCircle, HelpCircle, MessageSquare, X } from 'lucide-react';
import { supabase, RSVPResponse } from '../lib/supabase';
import { SectionWrapper, AnimateIn } from './common/SectionWrapper';

interface GuestbookProps {
  isDark: boolean;
  backgroundImage?: string;
  initialName?: string;
}

export const Guestbook: React.FC<GuestbookProps> = ({ isDark, backgroundImage, initialName }) => {
  const [messages, setMessages] = useState<RSVPResponse[]>([]);
  const [formData, setFormData] = useState<Omit<RSVPResponse, 'id' | 'created_at'>>({
    name: initialName || '',
    message: '',
    attendance: 'yes',
    parent_id: null
  });
  const [replyingTo, setReplyingTo] = useState<{ id: string, name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .order('created_at', { ascending: true }); // Ascending for comments stream usually

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Organize messages into threads
  const threads = useMemo(() => {
    const parents = messages.filter(m => !m.parent_id).sort((a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    const replies = messages.filter(m => m.parent_id);

    return parents.map(parent => ({
      ...parent,
      replies: replies
        .filter(r => r.parent_id === parent.id)
        .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
    }));
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        parent_id: replyingTo?.id || null
      };

      const { data, error } = await supabase
        .from('rsvp_responses')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setFormData({ name: '', message: '', attendance: 'yes', parent_id: null });
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 604800;
    if (interval > 1) return Math.floor(interval) + " minggu lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "Baru saja";
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'yes': return <CheckCircle size={14} className="text-green-500 ml-1 inline" />;
      case 'no': return <XCircle size={14} className="text-red-500 ml-1 inline" />;
      case 'maybe': return <HelpCircle size={14} className="text-orange-500 ml-1 inline" />;
      default: return null;
    }
  };

  const handleReply = (msg: RSVPResponse) => {
    setReplyingTo({ id: msg.id!, name: msg.name });
    const formElement = document.getElementById('guestbook-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SectionWrapper
      id="guestbook"
      isDark={isDark}
      backgroundImage={backgroundImage}
    >
      {(shouldAnimate) => (
        <div className="container mx-auto px-4 sm:px-6 w-full">
          <AnimateIn shouldAnimate={shouldAnimate} from="top" delay={100} className="text-center mb-8">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-800'
              }`}>
              Wishes
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Berikan ucapan harapan dan do’a kepada kedua mempelai
            </p>
          </AnimateIn>

          <div className="max-w-3xl mx-auto">
            {/* Input Form */}
            <AnimateIn shouldAnimate={shouldAnimate} from="bottom" delay={300}>
              <form
                id="guestbook-form"
                onSubmit={handleSubmit}
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}
              >
                {replyingTo && (
                  <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-900/30 p-2 rounded-lg mb-4 border border-rose-100 dark:border-rose-800">
                    <span className="text-sm text-rose-600 dark:text-rose-300">
                      Membalas ke <span className="font-bold">{replyingTo.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nama</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama Anda"
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-rose-500 focus:border-transparent ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Konfirmasi Kehadiran</label>
                      <select
                        value={formData.attendance}
                        onChange={(e) => setFormData(prev => ({ ...prev, attendance: e.target.value as any }))}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-rose-500 focus:border-transparent ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      >
                        <option value="yes">Hadir</option>
                        <option value="no">Tidak Hadir</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Ucapan & Doa</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={replyingTo ? `Balas kepada ${replyingTo.name}...` : "Tulis ucapan selamat dan doa..."}
                      required
                      rows={3}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim() || !formData.message.trim()}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>{replyingTo ? 'Kirim Balasan' : 'Kirim Ucapan'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </AnimateIn>

            {/* Scrollable Message Box */}
            <div className={`mt-8 rounded-xl shadow-inner overflow-hidden border ${isDark ? 'bg-black/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="h-[400px] overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                    <MessageSquare size={48} className="mb-2" />
                    <p>Belum ada ucapan. Jadilah yang pertama!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {threads.map((thread) => (
                      <div key={thread.id} className="group">
                        {/* Parent Message */}
                        <div className="mb-1">
                          <div className="flex items-center mb-1">
                            <h4 className="font-bold text-rose-600 text-base sm:text-lg">
                              {thread.name}
                            </h4>
                            {getAttendanceBadge(thread.attendance)}
                          </div>
                          <p className={`text-sm sm:text-base leading-relaxed mb-1 whitespace-pre-line ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            {thread.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400">
                            <span>{timeAgo(thread.created_at)}</span>
                            <button
                              onClick={() => handleReply(thread)}
                              className="font-medium hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {/* Replies */}
                        {thread.replies.length > 0 && (
                          <div className={`ml-4 sm:ml-8 pl-4 border-l-2 ${isDark ? 'border-gray-700' : 'border-gray-300'} space-y-4 mt-3`}>
                            {thread.replies.map((reply) => (
                              <div key={reply.id}>
                                <div className="flex items-center mb-1">
                                  <h4 className="font-bold text-rose-600 text-sm sm:text-base">
                                    {reply.name}
                                  </h4>
                                  {getAttendanceBadge(reply.attendance)}
                                </div>
                                <p className={`text-sm sm:text-base leading-relaxed mb-1 whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {reply.message}
                                </p>
                                <span className="text-xs text-gray-500">{timeAgo(reply.created_at)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};