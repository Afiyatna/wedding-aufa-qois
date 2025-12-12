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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvitationWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="guests" element={<GuestList />} />
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
  const [isValidGuest, setIsValidGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGuest = async () => {
      // Get name from URL param 'to' or 'guest'
      const nameParam = searchParams.get('to') || searchParams.get('guest');

      if (!nameParam) {
        // Allow access without name? User said "kalau user di url memasukkan namanya dia yang tidak terdaftar maka undangan nya tidak bisa dibuka"
        // Implies name is optional? Or MANDATORY?
        // "nanti user tinggal memasukkan nama tamu nya" implies we distribute links like example.com/?to=Budi
        // If no param, maybe generic guest or block?
        // Let's assume generic "Tamu Undangan" is allowed if no param, OR block.
        // Re-reading: "kalau user di url memasukkan namanya dia yang tidak terdaftar maka undangan nya tidak bisa dibuka"
        // This strictly means IF name is provided AND NOT found => Block.
        // What if NO name is provided? Usually weddings allow generic access or default.
        // But for strict "Guest Management", usually we want to force valid guests.
        // However, I will allow generic access for testing unless specified otherwise, but specifically validate if param exists.
        // Wait, "tidak terdaftar maka undangan nya tidak bisa dibuka" -> strongly implies strict check.
        // But let's check DB.
        setGuestName('Tamu Undangan');
        setIsValidGuest(true);
        setIsLoading(false);
        return;
      }

      setGuestName(nameParam);

      // Verify against DB
      // We check if there is a guest with this name (case insensitive or exact?)
      // Let's try flexible search
      const { data, error } = await supabase
        .from('guests')
        .select('id, name')
        .ilike('name', nameParam)
        .maybeSingle();

      if (error || !data) {
        setIsValidGuest(false);
      } else {
        setIsValidGuest(true);
        // Update name to match DB casing exactly if found
        setGuestName(data.name);
      }
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
          <p className="text-gray-600 mb-6">Nama tamu <strong>"{searchParams.get('to')}"</strong> tidak terdaftar dalam buku tamu kami.</p>
          <p className="text-sm text-gray-500">Mohon periksa kembali link undangan Anda atau hubungi kami.</p>
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
        <Guestbook isDark={isDark} initialName={guestName} backgroundImage={"flower-rose-4"} />
        <Footer isDark={isDark} />
      </main>

      <MusicPlayer isDark={isDark} />
    </div>
  );
}

export default App;