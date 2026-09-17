import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Music2, 
  FileText, 
  Sparkles, 
  X,
  ExternalLink
} from 'lucide-react';
import { SongTrack } from '../types';
import { bouzoukiEngine } from '../utils/audioSynth';

interface AudioPlayerBarProps {
  currentTrack: SongTrack;
  playlist: SongTrack[];
  onSelectTrack: (track: SongTrack) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  playlist,
  onSelectTrack
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsLanguage, setLyricsLanguage] = useState<'greek' | 'english'>('greek');

  useEffect(() => {
    bouzoukiEngine.setListener((status) => {
      setIsPlaying(status);
    });

    return () => {
      bouzoukiEngine.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      bouzoukiEngine.stop();
      setIsPlaying(false);
    } else {
      bouzoukiEngine.playMelody(currentTrack.audioSampleType, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex((s) => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    bouzoukiEngine.stop();
    onSelectTrack(playlist[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = playlist.findIndex((s) => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    bouzoukiEngine.stop();
    onSelectTrack(playlist[prevIndex]);
  };

  return (
    <>
      {/* Floating Mini Player Dock */}
      <aside aria-label="Official Music Player" className="fixed bottom-0 left-0 right-0 z-30 bg-[#0e1017]/95 backdrop-blur-md border-t border-[#d4af37]/30 shadow-2xl shadow-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Current Track info */}
          <div className="flex items-center gap-3.5 min-w-0 max-w-[320px]">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#d4af37]/30 flex-shrink-0 bg-black">
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-1 h-3 bg-[#d4af37] animate-pulse" />
                  <span className="w-1 h-5 bg-[#d4af37] animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-[#d4af37] animate-pulse delay-150" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white truncate hover:text-[#d4af37] cursor-pointer" onClick={() => setShowLyrics(true)}>
                  {currentTrack.title}
                </span>
                {currentTrack.isExclusive && (
                  <span className="bg-[#d4af37]/20 text-[#e5c158] text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                    HD
                  </span>
                )}
              </div>
              <p className="text-xs text-[#d4af37] truncate">
                {currentTrack.greekTitle} • <span className="text-stone-400">{currentTrack.album}</span>
              </p>
            </div>
          </div>

          {/* Central Controls & Waveform */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className="text-stone-400 hover:text-white transition-colors p-1"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black flex items-center justify-center shadow-lg shadow-[#d4af37]/30 hover:scale-105 transition-transform cursor-pointer"
                title={isPlaying ? "Pause Acoustic Preview" : "Play Bouzouki Solo Preview"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
              </button>

              <button 
                onClick={handleNext}
                className="text-stone-400 hover:text-white transition-colors p-1"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Waveform simulation indicator */}
            <div className="w-full flex items-center gap-2 text-[10px] text-stone-400 font-mono">
              <span>{isPlaying ? '0:14' : '0:00'}</span>
              <div className="flex-1 h-1.5 bg-[#232733] rounded-full overflow-hidden flex items-center">
                <div 
                  className={`h-full bg-gradient-to-r from-[#d4af37] to-[#f7df94] transition-all duration-300 ${
                    isPlaying ? 'w-2/5' : 'w-0'
                  }`}
                />
              </div>
              <span>{currentTrack.duration}</span>
              <span className="hidden sm:inline text-stone-500">• {currentTrack.views} views</span>
            </div>
          </div>

          {/* Action side tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLyrics(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#1a1e2b] text-stone-300 hover:text-[#d4af37] hover:bg-[#232733] border border-[#2e3447] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">View Lyrics</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-400 pl-2 border-l border-[#232733]">
              <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px]">Bouzouki Engine Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Lyrics & Track Details Drawer Modal */}
      {showLyrics && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-[#d4af37]/40 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#232733] flex items-center justify-between bg-[#151924]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#d4af37]/40">
                  <img src={currentTrack.coverUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-white">
                    {currentTrack.title} ({currentTrack.greekTitle})
                  </h2>
                  <p className="text-xs text-[#d4af37]">
                    Album: {currentTrack.album} ({currentTrack.year})
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowLyrics(false)}
                className="w-8 h-8 rounded-full bg-[#232733] hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="px-5 py-3 bg-[#0d0f15] border-b border-[#232733] flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5 text-[#d4af37]" />
                Official Lyric Composition
              </span>

              <div className="flex items-center gap-1 bg-[#181d2a] p-1 rounded-lg border border-[#232733] text-xs">
                <button
                  onClick={() => setLyricsLanguage('greek')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    lyricsLanguage === 'greek' 
                      ? 'bg-[#d4af37] text-black font-semibold' 
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Ελληνικά (Original)
                </button>
                <button
                  onClick={() => setLyricsLanguage('english')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    lyricsLanguage === 'english' 
                      ? 'bg-[#d4af37] text-black font-semibold' 
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  English Translation
                </button>
              </div>
            </div>

            {/* Lyrics Content */}
            <div className="p-6 overflow-y-auto flex-1 font-serif text-base leading-relaxed text-stone-200 whitespace-pre-line text-center bg-gradient-to-b from-[#11141d] to-[#0c0e14]">
              {lyricsLanguage === 'greek' ? currentTrack.lyricsFullGreek : currentTrack.lyricsEnglishTranslation}
            </div>

            {/* Footer action */}
            <div className="p-4 border-t border-[#232733] bg-[#151924] flex items-center justify-between">
              <div className="text-xs text-stone-400">
                Acoustic composition • {currentTrack.bpm} BPM
              </div>

              <button
                onClick={handleTogglePlay}
                className="px-4 py-2 rounded-full bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#e5c158] transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Bouzouki Solo' : 'Listen Bouzouki Solo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
