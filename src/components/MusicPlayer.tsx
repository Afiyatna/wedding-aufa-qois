import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isDark: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isDark }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Note: Using a placeholder audio URL - in a real implementation, 
  // you would upload your wedding song to a hosting service
  const audioUrl = "music/Kahitna-Soulmate.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;
    audio.muted = isMuted;

    return () => audio.removeEventListener('ended', handleEnded);
  }, [volume, isMuted]);

  // Auto-play when component mounts
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try to auto-play when component first mounts
    const attemptAutoPlay = async () => {
      try {
        audio.volume = volume;
        audio.muted = isMuted;
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // Auto-play was blocked by browser policy
        // User will need to click play button manually
        console.log('Auto-play blocked. User interaction required.');
        setIsPlaying(false);
      }
    };

    // Small delay to ensure audio is loaded
    const timer = setTimeout(() => {
      attemptAutoPlay();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
      audio.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
      isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-gray-200'
    }`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        autoPlay
      />
      
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`p-1.5 sm:p-2 rounded-full transition-colors touch-manipulation ${
            isDark 
              ? 'bg-maroon-500 text-white hover:bg-maroon-600' 
              : 'bg-maroon-500 text-white hover:bg-maroon-600'
          }`}
        >
          {isPlaying ? <Pause size={18} className="sm:w-5 sm:h-5" /> : <Play size={18} className="sm:w-5 sm:h-5" />}
        </button>

        {/* Volume Control - Hidden on mobile, shown on larger screens */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className={`p-1 rounded transition-colors touch-manipulation ${
              isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 sm:w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`
            }}
          />
        </div>

        {/* Music Note Icon - Hidden on mobile */}
        <div className={`hidden sm:block text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          🎵
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};