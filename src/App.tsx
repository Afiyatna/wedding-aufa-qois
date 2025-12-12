import React, { useState, useEffect } from 'react';
import { InvitationLanding } from './components/InvitationLanding';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { QuoteSection } from './components/QuoteSection';
import { QuotePage } from './components/QuotePage';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { EventDetails } from './components/EventDetails';
import { Gallery } from './components/Gallery';
import { Countdown } from './components/Countdown';
import { RSVPForm } from './components/RSVPForm';
import { Guestbook } from './components/Guestbook';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';

function App() {
  const [currentView, setCurrentView] = useState<'invitation' | 'splash' | 'main'>('invitation');
  const [isDark, setIsDark] = useState(false);

  // Get guest name from URL parameters or use default
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('guest') || 'Someone Special';
    return decodeURIComponent(guestName);
  };

  const guestName = getGuestName();

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('wedding-theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleOpenInvitation = () => {
    setCurrentView('splash');
  };

  const handleSplashComplete = () => {
    setCurrentView('main');
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wedding-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wedding-theme', 'light');
    }
  };

  // Show invitation landing page
  if (currentView === 'invitation') {
    return <InvitationLanding guestName={guestName} onOpenInvitation={handleOpenInvitation} backgroundImage={"flower-rose"} />;
  }

  // Show splash screen
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show main wedding invitation
  return (
    <div className={`max-w-[560px] mx-auto min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
      {/* <Header isDark={isDark} onThemeToggle={toggleTheme} /> */}

      <main className="scroll-container">
        <HeroSection isDark={isDark} guestName={guestName} backgroundImage={"flower-rose-2"} />
        <QuoteSection isDark={isDark} backgroundImage={"flower-rose-4"} />
        <QuotePage isDark={isDark} backgroundImage={"flower-rose-3"} />
        <EventDetails isDark={isDark} backgroundImage={"flower-rose-4"} />
        <DigitalEnvelope isDark={isDark} backgroundImage={"flower-rose-3"} />
        {/* <Gallery isDark={isDark} backgroundImage={"flower-rose-4"} /> */}
        <Countdown isDark={isDark} backgroundImage={"flower-rose-4"} />
        <RSVPForm isDark={isDark} backgroundImage={"flower-rose-3"} />
        <Guestbook isDark={isDark} backgroundImage={"flower-rose-4"} />
      </main>

      <Footer isDark={isDark} />
      <MusicPlayer isDark={isDark} />
    </div>
  );
}

export default App;