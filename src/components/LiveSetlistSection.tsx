import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Users, 
  Clock, 
  Music, 
  CheckCircle2, 
  Vote, 
  Play, 
  Pause, 
  RefreshCw, 
  Flower2, 
  ChevronRight,
  Disc3,
  Waves
} from 'lucide-react';
import { LiveSetlistState, LiveSetlistSong } from '../types';
import { bouzoukiEngine } from '../utils/audioSynth';

interface LiveSetlistSectionProps {
  onOpenBooking: () => void;
}

export const LiveSetlistSection: React.FC<LiveSetlistSectionProps> = ({ onOpenBooking }) => {
  const [liveState, setLiveState] = useState<LiveSetlistState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlayingBouzouki, setIsPlayingBouzouki] = useState<boolean>(false);
  const [selectedPreviewSong, setSelectedPreviewSong] = useState<LiveSetlistSong | null>(null);
  const [flowerBurst, setFlowerBurst] = useState<number[]>([]);
  const [hasVotedEncore, setHasVotedEncore] = useState<boolean>(false);
  const [isTogglingShow, setIsTogglingShow] = useState<boolean>(false);

  // Poll live setlist every 3 seconds
  const fetchLiveSetlist = async () => {
    try {
      const res = await fetch('/api/live-setlist');
      if (res.ok) {
        const data = await res.json();
        setLiveState(data);
      }
    } catch (err) {
      console.error('Failed to load live setlist', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSetlist();
    const interval = setInterval(fetchLiveSetlist, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen to bouzouki synth audio state
  useEffect(() => {
    bouzoukiEngine.setListener((playing) => {
      setIsPlayingBouzouki(playing);
    });
  }, []);

  // Handle Play/Stop Bouzouki solo
  const handleToggleBouzouki = (songType: 'bouzouki_laiko' | 'romantic_ballad' | 'uptempo_anthem' = 'bouzouki_laiko') => {
    if (isPlayingBouzouki) {
      bouzoukiEngine.stop();
    } else {
      bouzoukiEngine.playMelody(songType, () => {
        setIsPlayingBouzouki(false);
      });
    }
  };

  // Handle throwing virtual Garifalla (flower trays) onto the stage
  const handleThrowFlowers = async (count: number = 3) => {
    try {
      // Create flying flower particles
      const newIds = Array.from({ length: 8 }, (_, i) => Date.now() + i);
      setFlowerBurst(prev => [...prev, ...newIds]);

      setTimeout(() => {
        setFlowerBurst(prev => prev.filter(id => !newIds.includes(id)));
      }, 2000);

      const res = await fetch('/api/live-setlist/throw-flowers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: count })
      });

      if (res.ok) {
        const data = await res.json();
        if (liveState) {
          setLiveState(prev => prev ? {
            ...prev,
            flowerBasketsTotal: data.totalTonight,
            setlist: prev.setlist.map((s, idx) => 
              idx === prev.currentSongIndex ? { ...s, flowerTrays: data.songTotal } : s
            )
          } : null);
        }
      }
    } catch (e) {
      console.error('Failed to throw flowers', e);
    }
  };

  // Handle voting for encore song
  const handleVoteEncore = async (pollId: string) => {
    if (hasVotedEncore) return;
    try {
      const res = await fetch('/api/live-setlist/vote-encore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId })
      });

      if (res.ok) {
        const data = await res.json();
        setHasVotedEncore(true);
        if (liveState) {
          setLiveState(prev => prev ? { ...prev, encorePoll: data.encorePoll } : null);
        }
      }
    } catch (e) {
      console.error('Failed to vote encore', e);
    }
  };

  // Toggle Live show status (active vs standby rehearsal)
  const handleToggleShow = async () => {
    setIsTogglingShow(true);
    try {
      const res = await fetch('/api/live-setlist/toggle-show', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (liveState) {
          setLiveState(prev => prev ? { ...prev, isActive: data.isActive } : null);
        }
      }
    } catch (e) {
      console.error('Failed to toggle live show', e);
    } finally {
      setIsTogglingShow(false);
    }
  };

  // Jump to specific song in setlist
  const handleSetSong = async (index: number) => {
    try {
      const res = await fetch('/api/live-setlist/set-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      if (res.ok) {
        await fetchLiveSetlist();
      }
    } catch (e) {
      console.error('Failed to change song', e);
    }
  };

  if (isLoading || !liveState) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#10131d] border border-[#232733] rounded-3xl p-8 text-center animate-pulse">
          <Radio className="w-8 h-8 text-[#d4af37] mx-auto mb-3 animate-spin" />
          <p className="text-sm text-stone-400">Connecting to YTON Athens Live Stage Feed...</p>
        </div>
      </div>
    );
  }

  const currentSong = liveState.setlist[liveState.currentSongIndex] || liveState.setlist[3];
  const progressPercent = Math.min(100, Math.round((liveState.elapsedSec / (currentSong.durationSec || 260)) * 100));

  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#0b0c10] via-[#0f121a] to-[#0b0c10] border-t border-b border-[#232733] relative overflow-hidden">
      {/* Background Concert Stage Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#d4af37]/10 blur-[140px] pointer-events-none" />

      {/* Floating Garifalla Carnations Animation Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {flowerBurst.map((id, index) => (
          <div
            key={id}
            className="absolute text-rose-500 font-bold text-xl select-none"
            style={{
              left: `${35 + (index * 8) + (Math.random() * 10)}%`,
              bottom: '10%',
              animation: 'floatUpwards 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header & Live Broadcast Status */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                liveState.isActive 
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/20' 
                  : 'bg-stone-800 text-stone-400 border border-stone-700'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${liveState.isActive ? 'bg-rose-500 animate-ping' : 'bg-stone-500'}`} />
                {liveState.isActive ? 'LIVE CONCERT STREAM • YTON ATHENS' : 'STANDBY • COUNTDOWN TO TONIGHT'}
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-400 bg-[#161c28] border border-[#232733] px-2.5 py-0.5 rounded-full">
                <Radio className="w-3 h-3 text-[#d4af37]" />
                Direct Soundboard Feed 96kHz
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Dynamic Live Setlist & Stage Teleprompter</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              Track the exact concert song progression at the revolutionary YTON amphitheater in real time. Experience live lyrics, acoustic bouzouki previews, and throw virtual flower trays (garifalla) onto the stage.
            </p>
          </div>

          {/* Live Show Quick Toggle & Simulation Controls */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={handleToggleShow}
              disabled={isTogglingShow}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                liveState.isActive
                  ? 'bg-[#1b2233] text-stone-300 border-[#2e374d] hover:border-[#d4af37]'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}
              title="Toggle concert active status for real-time live simulation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTogglingShow ? 'animate-spin' : ''}`} />
              <span>{liveState.isActive ? 'Pause Stage Feed' : 'Simulate Show Active'}</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Book Table at YTON</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Arena Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-[#11141e] border border-[#232733] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Audience at YTON</span>
              <span className="text-lg font-black font-mono text-white">
                {liveState.attendeesCount.toLocaleString()} <span className="text-xs font-normal text-stone-400">fans</span>
              </span>
            </div>
          </div>

          <div className="bg-[#11141e] border border-[#232733] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Stage Energy</span>
              <span className="text-lg font-black font-mono text-rose-400">
                {liveState.atmosphereRating}% <span className="text-xs font-normal text-stone-400">Electric</span>
              </span>
            </div>
          </div>

          <div className="bg-[#11141e] border border-[#232733] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center flex-shrink-0">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Garifalla Baskets</span>
              <span className="text-lg font-black font-mono text-[#fbcfe8]">
                {liveState.flowerBasketsTotal} <span className="text-xs font-normal text-stone-400">trays thrown</span>
              </span>
            </div>
          </div>

          <div className="bg-[#11141e] border border-[#232733] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Concert Progression</span>
              <span className="text-lg font-black font-mono text-[#38bdf8]">
                Song {liveState.currentSongIndex + 1} <span className="text-xs font-normal text-stone-400">of {liveState.setlist.length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* HERO LIVE STAGE CARD: Current Song Performing Right Now */}
        <div className="bg-gradient-to-br from-[#181d2b] via-[#121622] to-[#0c0e15] border-2 border-[#d4af37] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold ray effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/15 blur-[100px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Revolving Disc & Performer Visual */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4">
                {/* Vinyl Grooves & Revolving stage animation */}
                <div className={`w-full h-full rounded-full bg-[#0a0b10] border-4 border-[#d4af37] shadow-2xl flex items-center justify-center relative overflow-hidden ${
                  liveState.isActive ? 'animate-spin' : ''
                }`} style={{ animationDuration: '30s' }}>
                  {/* Concentric rings */}
                  <div className="w-40 h-40 rounded-full border border-stone-800" />
                  <div className="w-28 h-28 rounded-full border border-stone-800" />
                  <div className="w-16 h-16 rounded-full bg-[#1b2133] border-2 border-[#d4af37] flex items-center justify-center text-center">
                    <Music className="w-6 h-6 text-[#d4af37]" />
                  </div>
                </div>

                {/* Live Pill badge on vinyl */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>ON STAGE NOW</span>
                </div>
              </div>

              <span className="text-xs text-stone-400 font-mono">
                {currentSong.act}
              </span>
              <span className="text-[11px] text-[#e5c158] font-semibold mt-0.5">
                Nikos Vertis & Full 25-Piece Live Bouzouki
              </span>
            </div>

            {/* Right: Song Information, Live Lyrics, & Dionysian Actions */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-1.5">
                    <Disc3 className="w-3.5 h-3.5" />
                    Now Performing Live
                  </span>
                  <span className="text-xs font-mono text-stone-400 bg-[#0c0e15] px-2.5 py-1 rounded-lg border border-[#232733]">
                    Estimated: {currentSong.estimatedTime}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                  {currentSong.title}
                </h3>
                <h4 className="text-lg sm:text-xl font-serif text-[#e5c158] font-bold mt-1">
                  {currentSong.greekTitle}
                </h4>

                <div className="flex items-center gap-3 text-xs text-stone-400 mt-2 mb-5">
                  <span>Album: <strong className="text-stone-200">{currentSong.album}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-stone-200">{currentSong.duration}</strong></span>
                  <span>•</span>
                  <span className="text-rose-400 font-semibold">{currentSong.flowerTrays} Flower Baskets on Stage</span>
                </div>

                {/* Real-time Elapsed Progress Bar */}
                <div className="bg-[#0b0d14] border border-[#232733] rounded-2xl p-4 mb-5">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                    <span className="flex items-center gap-1.5 text-[#e5c158]">
                      <Waves className="w-3.5 h-3.5 animate-pulse" />
                      Live Progress
                    </span>
                    <span>
                      {formatTime(liveState.elapsedSec)} / {currentSong.duration}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-[#1b2133] rounded-full overflow-hidden p-0.5 border border-[#2c354a]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#d4af37] via-[#fef08a] to-[#e5c158] rounded-full transition-all duration-1000 shadow-md shadow-[#d4af37]/40"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Live Synchronized Teleprompter Lyrics Box */}
                <div className="bg-[#0c0f18] border border-[#242c40] rounded-2xl p-4 sm:p-5 mb-6 relative">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block mb-2">
                    ★ Synchronized Stage Lyrics (Greek & English)
                  </span>
                  <p className="text-base sm:text-lg font-serif font-bold text-white leading-relaxed">
                    "{currentSong.lyricsGreek}"
                  </p>
                  <p className="text-xs sm:text-sm text-stone-400 italic mt-2 border-t border-[#1a2130] pt-2">
                    "{currentSong.lyricsEnglish}"
                  </p>
                </div>
              </div>

              {/* Action Buttons: Bouzouki Audio Solo & Throw Flower Trays */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Bouzouki Solo Player */}
                <button
                  onClick={() => handleToggleBouzouki('uptempo_anthem')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs tracking-wide transition-all cursor-pointer ${
                    isPlayingBouzouki
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                      : 'bg-[#182030] text-[#fef08a] border border-[#d4af37]/60 hover:bg-[#20293d]'
                  }`}
                >
                  {isPlayingBouzouki ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Bouzouki Solo</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Live Bouzouki Solo</span>
                    </>
                  )}
                </button>

                {/* Throw Garifalla Trays onto Stage */}
                <button
                  onClick={() => handleThrowFlowers(3)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-rose-600/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Flower2 className="w-4 h-4" />
                  <span>Throw Garifalla Trays (❀ +3)</span>
                </button>

                {/* Advance or switch to next song in live simulation */}
                <button
                  onClick={() => handleSetSong((liveState.currentSongIndex + 1) % liveState.setlist.length)}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-[#141926] text-stone-300 hover:text-white border border-[#232733] hover:border-stone-500 text-xs font-semibold transition-all cursor-pointer"
                  title="Advance stage to next song in setlist"
                >
                  <span>Next Song in Show</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FULL CHRONOLOGICAL SETLIST & ENCORE VOTING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Setlist Tracks (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-[#d4af37]" />
                Complete YTON Concert Setlist
              </h3>
              <span className="text-xs text-stone-400">
                12 Songs • 3.5 Hour Grand Performance
              </span>
            </div>

            {liveState.setlist.map((song, idx) => {
              const isCurrent = idx === liveState.currentSongIndex;
              const isCompleted = idx < liveState.currentSongIndex;
              const isEncore = song.status === 'encore';

              return (
                <div
                  key={song.id}
                  onClick={() => handleSetSong(idx)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 group ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#1c2436] to-[#121622] border-[#d4af37] shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                      : isCompleted
                      ? 'bg-[#0f121a]/80 border-[#1f2433] opacity-75 hover:opacity-100 hover:border-stone-600'
                      : isEncore
                      ? 'bg-[#181324] border-purple-500/40 hover:border-purple-400'
                      : 'bg-[#11141e] border-[#202535] hover:border-stone-600 hover:bg-[#151926]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Track Number / Status Icon */}
                    <div className="flex-shrink-0 w-8 text-center">
                      {isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-black text-xs flex items-center justify-center animate-pulse">
                          ▶
                        </div>
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-mono font-bold text-stone-500">
                          #{song.order < 10 ? `0${song.order}` : song.order}
                        </span>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-display font-bold text-sm truncate ${isCurrent ? 'text-[#fef08a]' : 'text-white'}`}>
                          {song.title}
                        </h4>
                        <span className="text-xs font-serif text-[#d4af37] truncate hidden sm:inline">
                          ({song.greekTitle})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-0.5">
                        <span className="truncate">{song.act}</span>
                        <span>•</span>
                        <span>{song.duration}</span>
                        {song.flowerTrays > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-rose-400 font-medium">❀ {song.flowerTrays}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone-400 hidden sm:block">
                      {song.estimatedTime}
                    </span>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCurrent
                        ? 'bg-[#d4af37] text-black animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isEncore
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-stone-800 text-stone-400'
                    }`}>
                      {isCurrent ? 'On Stage' : isCompleted ? 'Completed' : isEncore ? 'Encore Finale' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Fan Encore Voting & Flower Stand (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Encore Fan Poll Card */}
            <div className="bg-[#121622] border border-purple-500/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Vote className="w-4 h-4 text-purple-400" />
                <span>Live Audience Encore Poll</span>
              </div>
              <h3 className="font-display font-extrabold text-white text-lg">
                Vote for the Closing Ballad
              </h3>
              <p className="text-xs text-stone-400 mt-1 mb-5">
                Every night at 03:00, Nikos Vertis sings the #1 fan-voted song as the acoustic sunrise finale at YTON. Cast your verified vote!
              </p>

              {/* Poll Options */}
              <div className="space-y-3">
                {liveState.encorePoll.map((poll) => {
                  const totalVotes = liveState.encorePoll.reduce((acc, p) => acc + p.votes, 0);
                  const percentage = totalVotes > 0 ? Math.round((poll.votes / totalVotes) * 100) : 0;

                  return (
                    <div
                      key={poll.id}
                      onClick={() => handleVoteEncore(poll.id)}
                      className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                        hasVotedEncore
                          ? 'bg-[#0e111a] border-[#232733]'
                          : 'bg-[#151a29] border-[#283147] hover:border-purple-400 hover:bg-[#1a2133]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                        <span>{poll.title}</span>
                        <span className="font-mono text-purple-300">{percentage}%</span>
                      </div>

                      {/* Vote Progress Bar */}
                      <div className="w-full h-2 bg-[#090b10] rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>{poll.greekTitle}</span>
                        <span>{poll.votes} votes</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasVotedEncore && (
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Your live audience vote has been transmitted to Nikos's stage monitor!</span>
                </div>
              )}
            </div>

            {/* Stage Flower Tradition (Garifalla) Info Card */}
            <div className="bg-[#11141e] border border-[#232733] rounded-3xl p-6">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Flower2 className="w-4 h-4" />
                <span>The Greek "Garifalla" Tradition</span>
              </div>
              <h4 className="font-display font-bold text-white text-base">
                Bouzoukia Stage Flower Trays
              </h4>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                At YTON Athens, expressing passion by showering the stage with fresh red carnation baskets (garifalla) is an iconic Hellenic custom during the zeibekiko solos and ballads.
              </p>

              <div className="mt-4 pt-4 border-t border-[#232733] flex items-center justify-between text-xs">
                <span className="text-stone-400">Included with VIP Tables:</span>
                <span className="font-mono font-bold text-[#e5c158]">3-5 Trays included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
