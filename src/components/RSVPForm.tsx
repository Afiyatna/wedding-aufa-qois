import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, RSVPResponse } from '../lib/supabase';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface RSVPFormProps {
  isDark: boolean;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ isDark }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [formData, setFormData] = useState<RSVPResponse>({
    name: '',
    email: '',
    phone: '',
    attendance: 'yes',
    guest_count: 1,
    dietary_restrictions: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guest_count' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('rsvp_responses')
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendance: 'yes',
        guest_count: 1,
        dietary_restrictions: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="rsvp"
      ref={ref}
      className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className={`text-4xl md:text-5xl font-serif mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Konfirmasi Kehadiran
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Mohon konfirmasi kehadiran Anda
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className={`p-8 rounded-2xl shadow-lg transition-all duration-1000 delay-200 ${
              hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Apakah Anda akan hadir? *
                </label>
                <select
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="yes">Ya, saya hadir</option>
                  <option value="no">Maaf, tidak bisa hadir</option>
                  <option value="maybe">Mungkin</option>
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Jumlah Tamu
                </label>
                <input
                  type="number"
                  name="guest_count"
                  min="1"
                  max="10"
                  value={formData.guest_count}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Dietary Restrictions */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Kebutuhan makanan / catatan khusus
                </label>
                <textarea
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent resize-none ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Tuliskan kebutuhan makanan atau catatan khusus..."
                ></textarea>
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pesan untuk kami
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-maroon-500 focus:border-transparent resize-none ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Tuliskan doa atau ucapan untuk kami..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="w-full bg-gradient-to-r from-maroon-500 to-maroon-500 text-white py-4 px-6 rounded-lg font-medium transition-all duration-300 hover:from-maroon-600 hover:to-maroon-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Kirim RSVP</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Terima kasih! Konfirmasi kehadiran Anda berhasil dikirim.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center space-x-2">
                <AlertCircle size={20} />
                <span>Maaf, terjadi kesalahan saat mengirim RSVP. Silakan coba lagi.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};