import React, { useState } from 'react';
import { 
  Play, 
  Lock, 
  Unlock, 
  Sparkles, 
  Film, 
  Music, 
  Camera, 
  Eye, 
  ThumbsUp, 
  Download, 
  Clock, 
  X,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { EXCLUSIVE_VAULT_ITEMS } from '../data/vertisData';
import { ExclusiveContentItem, UserProfile } from '../types';
import { bouzoukiEngine } from '../utils/audioSynth';

interface ExclusiveContentSectionProps {
  user: UserProfile;
  onUpgradeTier: () => void;
}

export const ExclusiveContentSection: React.FC<ExclusiveContentSectionProps> = ({
  user,
  onUpgradeTier
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<ExclusiveContentItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [simulatedPlaying, setSimulatedPlaying] = useState(false);

  const categories = ['All', 'Full Concerts', 'Acoustic Solos', 'Backstage YTON', 'Studio Vault'];

  const filteredItems = activeCategory === 'All' 
    ? EXCLUSIVE_VAULT_ITEMS 
    : EXCLUSIVE_VAULT_ITEMS.filter((item) => item.category === activeCategory);

  const isItemUnlocked = (item: ExclusiveContentItem) => {
    if (item.requiredTier === 'Free') return true;
    if (item.requiredTier === 'Silver') return user.tier === 'Silver Privé' || user.tier === 'Diamond VIP';
    if (item.requiredTier === 'Diamond VIP') return user.tier === 'Diamond VIP';
    return true;
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenItem = (item: ExclusiveContentItem) => {
    setSelectedItem(item);
    setSimulatedPlaying(true);
    if (item.type === 'audio_unreleased') {
      bouzoukiEngine.playMelody('romantic_ballad');
    }
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
    setSimulatedPlaying(false);
    bouzoukiEngine.stop();
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#232733] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#e5c158] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Artist Direct Archival Vault
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exclusive Content & Backstage Vault
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Stream unreleased acoustic studio takes, 4K multi-cam recordings from YTON Athens, and behind-the-scenes bouzouki masterclasses direct from Nikos Vertis's personal archive.
          </p>
        </div>

        {/* VIP Status card */}
        <div className="bg-[#141824] border border-[#d4af37]/30 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#e5c158]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-stone-400">Your Current Pass:</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{user.tier}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                Active
              </span>
            </div>
          </div>
          {user.tier !== 'Diamond VIP' && (
            <button
              onClick={onUpgradeTier}
              className="ml-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black font-bold text-xs hover:brightness-110 cursor-pointer"
            >
              Upgrade VIP
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                : 'bg-[#12151f] text-stone-400 hover:text-white border border-[#232733]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const unlocked = isItemUnlocked(item);
          const isLiked = !!likedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => (unlocked ? handleOpenItem(item) : onUpgradeTier())}
              className="bg-[#11141d] border border-[#232733] hover:border-[#d4af37]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141d] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-stone-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-wider flex items-center gap-1">
                    {item.type === 'video_4k' && <Film className="w-3 h-3 text-[#38bdf8]" />}
                    {item.type === 'audio_unreleased' && <Music className="w-3 h-3 text-[#e5c158]" />}
                    {item.type === 'masterclass' && <Sparkles className="w-3 h-3 text-amber-400" />}
                    {item.type === 'photo_vault' && <Camera className="w-3 h-3 text-emerald-400" />}
                    <span>{item.category}</span>
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.requiredTier === 'Free'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : item.requiredTier === 'Silver'
                        ? 'bg-slate-400/20 text-slate-300 border-slate-400/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {item.requiredTier === 'Free' ? 'Public Fan' : `${item.requiredTier} Only`}
                  </span>
                </div>

                {/* Center Play or Lock Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {unlocked ? (
                    <div className="w-12 h-12 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg shadow-[#d4af37]/40 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-stone-900/90 border border-stone-600 text-stone-400 flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Duration / Items count */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white font-mono text-[11px] px-2 py-0.5 rounded">
                  {item.duration || `${item.itemsCount} Photos`}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-white text-base group-hover:text-[#d4af37] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#232733] flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {item.views.toLocaleString()} views
                  </span>

                  <button
                    onClick={(e) => toggleLike(item.id, e)}
                    className={`flex items-center gap-1 transition-colors ${
                      isLiked ? 'text-rose-400' : 'hover:text-stone-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{item.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video & Media Modal Player */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-[#d4af37]/40 rounded-2xl max-w-3xl w-full shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Player top */}
            <div className="px-5 py-3.5 bg-[#161a26] border-b border-[#232733] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                  Archival Stream: {selectedItem.category}
                </span>
              </div>
              <button
                onClick={handleCloseItem}
                className="w-8 h-8 rounded-full bg-[#202534] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Screen Simulation */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedItem.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover opacity-60 filter blur-[1px]"
              />

              {/* Dynamic stage visuals */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 text-[#e5c158] animate-spin" />
                </div>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-white max-w-lg">
                  {selectedItem.title}
                </h4>
                <p className="text-xs text-stone-300 mt-2 max-w-md">
                  {selectedItem.description}
                </p>

                {/* Animated sound waves */}
                <div className="flex items-center gap-1 mt-4">
                  {[4, 8, 14, 20, 12, 18, 6, 15, 22, 10, 5].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#d4af37] rounded-full animate-pulse"
                      style={{ height: `${h * 1.5}px`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Body & Controls */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#232733] pb-4">
                <div>
                  <span className="text-[11px] text-[#38bdf8] font-semibold uppercase">
                    Direct Soundboard Master • 48kHz 24-Bit Audio
                  </span>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                    <span>Released: {selectedItem.releaseDate}</span>
                    <span>•</span>
                    <span>Required Tier: <strong className="text-white">{selectedItem.requiredTier}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (selectedItem.type === 'audio_unreleased') {
                        bouzoukiEngine.playMelody('romantic_ballad');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs flex items-center gap-2 hover:bg-[#e5c158] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Replay Audio</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-stone-300 leading-relaxed bg-[#0b0d13] p-4 rounded-xl border border-[#232733]">
                <strong className="text-white block mb-1">Archival Note by Nikos Vertis Management:</strong>
                "This performance capture is produced exclusively for our verified fan community. Recorded live at Petrou Ralli 38 using the venue's custom 360-degree Martin Audio line arrays. All rights reserved by YTON Productions."
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
