import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Components
import { InvitationLanding } from './components/InvitationLanding';
import { HeroSection } from './components/HeroSection';
import { QuoteSection } from './components/QuoteSection';
import { QuotePage } from './components/QuotePage';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { EventDetails } from './components/EventDetails';
import { Countdown } from './components/Countdown';
import { Guestbook } from './components/Guestbook';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';

// Pages
import Login from './pages/Login';
import DashboardLayout from './pages/Dashboard/Layout';
import Overview from './pages/Dashboard/Overview';
import GuestList from './pages/Dashboard/GuestList';
import Comments from './pages/Dashboard/Comments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvitationWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="guests" element={<GuestList />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function InvitationWrapper() {
  const [currentView, setCurrentView] = useState<'invitation' | 'main'>('invitation');
  const [isDark, setIsDark] = useState(false);
  const [searchParams] = useSearchParams();
  const [guestName, setGuestName] = useState<string>('');
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isValidGuest, setIsValidGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGuest = async () => {
      // Priority 1: Check for Unique ID 'u'
      const idParam = searchParams.get('u');
      // Priority 2: Legacy/Fallback Name 'to' or 'guest'
      const nameParam = searchParams.get('to') || searchParams.get('guest');

      if (idParam) {
        // ID-based lookup (Secure)
        const { data, error } = await supabase
          .from('guests')
          .select('id, name')
          .eq('id', idParam)
          .maybeSingle();

        if (error || !data) {
          setIsValidGuest(false);
        } else {
          setIsValidGuest(true);
          setGuestName(data.name);
          setGuestId(data.id);
        }
        setIsLoading(false);
        return;
      }

      // Name-based lookup (Legacy)
      if (nameParam) {
        const { data, error } = await supabase
          .from('guests')
          .select('id, name')
          .ilike('name', nameParam)
          .maybeSingle();

        if (error || !data) {
          setIsValidGuest(false);
        } else {
          setIsValidGuest(true);
          setGuestName(data.name);
          setGuestId(data.id);
        }
        setIsLoading(false);
        return;
      }

      // No params provided
      // setGuestName('Tamu Undangan');
      // setIsValidGuest(true);
      // For strict mode, block access if no param
      setIsValidGuest(false);
      setIsLoading(false);
    };

    checkGuest();
  }, [searchParams]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('wedding-theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleOpenInvitation = () => {
    setCurrentView('main');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div></div>;
  }

  if (!isValidGuest) {
    return (
      <div className="min-h-screen flex items-col justify-center items-center bg-gray-50 p-4 font-serif text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl text-gray-800 mb-4">Maaf, Undangan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6 font-sans">
            Undangan ini bersifat privat. Pastikan Anda mengakses melalui link yang benar.
          </p>
          <p className="text-sm text-gray-500 font-sans">Hubungi kami jika Anda mengalami kendala.</p>
        </div>
      </div>
    );
  }

  if (currentView === 'invitation') {
    return <InvitationLanding guestName={guestName} onOpenInvitation={handleOpenInvitation} backgroundImage={"flower-rose-2"} />;
  }

  return (
    <div className={`max-w-[450px] mx-auto min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
      <main className="scroll-container">
        <HeroSection isDark={isDark} guestName={guestName} backgroundImage={"flower-rose-5"} />
        <QuoteSection isDark={isDark} backgroundImage={"flower-rose-4"} />
        <QuotePage isDark={isDark} backgroundImage={"flower-rose-3"} />
        <EventDetails isDark={isDark} backgroundImage={"flower-rose-4"} />
        <DigitalEnvelope isDark={isDark} backgroundImage={"flower-rose-3"} />
        <Countdown isDark={isDark} backgroundImage={"flower-rose-4"} />
        <Guestbook isDark={isDark} initialName={guestName} guestId={guestId} backgroundImage={"flower-rose-4"} />
        <Footer isDark={isDark} />
      </main>

      <MusicPlayer isDark={isDark} />
    </div>
  );
}

export default App;