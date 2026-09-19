import React, { useEffect, useState } from 'react';
import { Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { SONGS_DATA } from '../data/vertisData';
import { SongTrack } from '../types';
import { bouzoukiEngine } from '../utils/audioSynth';

export function MusicPreview() {
  const [track, setTrack] = useState<SongTrack>(SONGS_DATA[0]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    bouzoukiEngine.setListener(setPlaying);
    return () => bouzoukiEngine.stop();
  }, []);

  const play = (nextTrack = track) => {
    bouzoukiEngine.playMelody(nextTrack.audioSampleType, () => setPlaying(false));
    setPlaying(true);
  };

  const move = (direction: 1 | -1) => {
    const index = SONGS_DATA.findIndex((song) => song.id === track.id);
    const next = SONGS_DATA[(index + direction + SONGS_DATA.length) % SONGS_DATA.length];
    setTrack(next);
    play(next);
  };

  return (
    <section className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-[#d4af37]/40 bg-[#111827]/95 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <img src={track.coverUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-[#d4af37]">
            <Music2 className="h-3.5 w-3.5" /> Acoustic preview
          </div>
          <div className="truncate text-sm font-bold text-white">{track.title}</div>
          <div className="truncate text-xs text-slate-400">{track.greekTitle} • {track.duration}</div>
        </div>
        <button onClick={() => move(-1)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Previous song">
          <SkipBack className="h-4 w-4" />
        </button>
        <button onClick={() => (playing ? bouzoukiEngine.stop() : play())} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] text-black" aria-label={playing ? 'Pause song' : 'Play song'}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
        <button onClick={() => move(1)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Next song">
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-[10px] text-slate-500">Original synthesized preview. Licensed recordings require audio files and distribution rights.</div>
    </section>
  );
}
