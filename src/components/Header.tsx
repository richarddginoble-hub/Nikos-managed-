import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Music, 
  Calendar, 
  MessageSquare, 
  Film, 
  Ticket, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenVerifiedModal: () => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenVerifiedModal,
  onOpenBooking
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#232733]">
      {/* Top Verified Celebrity Official Banner */}
      <div className="bg-gradient-to-r from-[#141824] via-[#1a1710] to-[#141824] px-4 py-1.5 border-b border-[#d4af37]/20 text-xs text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#d4af37] font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              OFFICIAL VERIFIED CELEBRITY PLATFORM
            </span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="hidden sm:inline text-stone-400">
              YTON Productions & Nikos Vertis Official Management
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenVerifiedModal}
              className="text-[#d4af37] hover:text-[#f7df94] flex items-center gap-1 hover:underline transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Verify Legitimacy & Security</span>
            </button>
            <span className="text-stone-700">|</span>
            <span className="text-stone-400 hidden md:inline">YTON Athens Residency 2026/2027</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Artist Emblem */}
          <div 
            onClick={() => setActiveTab('experience')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#d4af37] via-[#997819] to-[#453609] p-[1.5px] shadow-lg shadow-[#d4af37]/10 group-hover:shadow-[#d4af37]/25 transition-all">
              <div className="w-full h-full rounded-full bg-[#0d0f15] flex items-center justify-center">
                <span className="font-display font-bold text-base text-[#e5c158] tracking-widest">
                  NV
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#0b0c10] rounded-full p-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] fill-[#0284c7]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-wider text-white group-hover:text-[#d4af37] transition-colors">
                  NIKOS VERTIS
                </h1>
                <span className="bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-xs text-stone-400 tracking-wide">
                Official Fan Experience & Live Bookings
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#131722]/80 border border-[#232733] p-1.5 rounded-full">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'experience'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-semibold shadow-md shadow-[#d4af37]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-semibold shadow-md shadow-[#d4af37]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Live Event Bookings</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-semibold shadow-md shadow-[#d4af37]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Exclusive Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-semibold shadow-md shadow-[#d4af37]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion Board</span>
            </button>

            <button
              onClick={() => setActiveTab('interactions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'interactions'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-semibold shadow-md shadow-[#d4af37]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Personalized Fan AI</span>
            </button>
          </nav>

          {/* User Profile & Quick Action */}
          <div className="flex items-center gap-3">
            {/* VIP Status Pill */}
            <div className="hidden sm:flex items-center gap-2.5 bg-[#141824] border border-[#d4af37]/30 rounded-full py-1.5 px-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-stone-300">
                Tier: <strong className="text-[#d4af37] font-semibold">{user.tier}</strong>
              </span>
              <span className="text-xs bg-[#d4af37]/15 text-[#e5c158] px-2 py-0.5 rounded-full font-mono font-medium">
                {user.fanPoints} pts
              </span>
            </div>

            {/* Quick Book Button */}
            <button
              onClick={onOpenBooking}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#a68019] text-black hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Reserve YTON Table</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2.5 scrollbar-none border-t border-[#232733]/60 text-xs">
          {[
            { id: 'experience', label: 'Overview', icon: Sparkles },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'vault', label: 'Vault', icon: Film },
            { id: 'community', label: 'Community', icon: MessageSquare },
            { id: 'interactions', label: 'Personalized AI', icon: Music }
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#141824] text-stone-300 border border-[#232733]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
