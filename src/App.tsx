import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Film, 
  MessageSquare, 
  Music, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  Ticket, 
  Users, 
  Flame, 
  Heart, 
  ChevronRight, 
  Clock, 
  Award,
  ArrowUpRight,
  QrCode,
  Download
} from 'lucide-react';
import { Header } from './components/Header';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { BookingSection } from './components/BookingSection';
import { ExclusiveContentSection } from './components/ExclusiveContentSection';
import { PersonalizedInteractions } from './components/PersonalizedInteractions';
import { CommunityBoard } from './components/CommunityBoard';
import { PaymentModal } from './components/PaymentModal';
import { VerifiedModal } from './components/VerifiedModal';
import { LiveSetlistSection } from './components/LiveSetlistSection';
import { INITIAL_USER, SONGS_DATA, VENUES_DATA, TABLE_CATEGORIES } from './data/vertisData';
import { SongTrack, UserProfile } from './types';
import { bouzoukiEngine } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('experience');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currentTrack, setCurrentTrack] = useState<SongTrack>(SONGS_DATA[0]);
  const [isVerifiedModalOpen, setIsVerifiedModalOpen] = useState(false);

  // Payment & Checkout state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [checkoutOrderData, setCheckoutOrderData] = useState<any>(null);
  const [userTickets, setUserTickets] = useState<any[]>([
    {
      bookingCode: 'VER-784912',
      transactionId: 'TXN-NV-INIT-9201',
      title: 'Stage-Front Diamond VIP Table (4 Guests)',
      venueName: 'YTON The Music Show (Athens)',
      date: 'Saturday, Oct 3, 2026',
      amount: 780,
      customerName: INITIAL_USER.name,
      qrPayload: 'NV-VIP:VER-784912:CONFIRMED'
    }
  ]);
  const [showWallet, setShowWallet] = useState(false);

  // Quick book launcher
  const handleStartBookingCheckout = (order: any) => {
    const tableIdLabel = order.specificTable?.id ? `Table #${order.specificTable.id}` : order.table.name;
    const distanceLabel = order.specificTable?.distanceMeters ? ` (${order.specificTable.distanceMeters}m to stage)` : '';

    setCheckoutOrderData({
      itemType: 'table_booking',
      title: `${tableIdLabel}${distanceLabel} — ${order.table.name} at ${order.venue.name}`,
      description: `Date: ${order.date} • Guests: ${order.guests} • Sightline: ${order.specificTable?.sightline || 'Direct Stage View'} • Add-ons: ${order.addons.length} items`,
      totalAmount: order.total,
      metadata: order
    });
    setIsPaymentOpen(true);
  };

  // Video shoutout launcher
  const handleOrderShoutout = (shoutoutReq: any) => {
    setCheckoutOrderData({
      itemType: 'personalized_shoutout',
      title: `Celebrity Video Greeting for ${shoutoutReq.recipientName}`,
      description: `Occasion: ${shoutoutReq.occasion} • Song: "${shoutoutReq.dedicationSong}" • Language: ${shoutoutReq.language}`,
      totalAmount: shoutoutReq.price,
      metadata: shoutoutReq
    });
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (receipt: any) => {
    setUserTickets((prev) => [
      {
        bookingCode: receipt.bookingCode,
        transactionId: receipt.transactionId,
        title: checkoutOrderData?.title || 'Verified Booking Pass',
        venueName: 'YTON The Music Show (Athens)',
        date: checkoutOrderData?.metadata?.date || 'Confirmed Performance',
        amount: receipt.amount,
        customerName: receipt.customer?.name || user.name,
        qrPayload: receipt.qrPayload || `NV-VIP:${receipt.bookingCode}`
      },
      ...prev
    ]);
    setUser((prev) => ({
      ...prev,
      ticketsCount: prev.ticketsCount + 1,
      fanPoints: prev.fanPoints + Math.floor(receipt.amount * 2)
    }));
  };

  const handleUpgradeTier = () => {
    setUser((prev) => ({
      ...prev,
      tier: 'Diamond VIP',
      fanPoints: prev.fanPoints + 500
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f0f2f5] pb-28 selection:bg-[#d4af37]/30 selection:text-[#f7df94]">
      {/* 1. Verified Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenVerifiedModal={() => setIsVerifiedModalOpen(true)}
        onOpenBooking={() => setActiveTab('bookings')}
      />

      {/* 2. Main Tab View Switcher */}
      <main>
        {activeTab === 'experience' && (
          <div>
            {/* HERO SECTION: Nikos Vertis Celebrity Platform */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#131722] via-[#0d0f15] to-[#0b0c10] pt-10 pb-16 border-b border-[#232733]">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#d4af37]/10 blur-[130px] rounded-full pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Hero Copy & Actions */}
                  <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c2233] border border-[#d4af37]/40 text-stone-200 text-xs shadow-lg">
                      <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                      <span className="font-semibold text-[#e5c158]">
                        Official Verified Fan Platform
                      </span>
                      <span className="text-stone-600">•</span>
                      <span className="text-stone-400">YTON Athens & World Tour</span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                      NIKOS VERTIS <br />
                      <span className="bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b38f24] bg-clip-text text-transparent">
                        OFFICIAL PLATFORM
                      </span>
                    </h1>

                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                      The exclusive digital home for verified fans worldwide. Experience direct table bookings at the revolutionary <strong className="text-white">YTON The Music Show</strong> amphitheater, stream unreleased acoustic masterclasses, order personalized video dedications, and join community discussions.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#a68019] text-black font-extrabold text-sm tracking-wide flex items-center gap-2.5 hover:brightness-110 shadow-xl shadow-[#d4af37]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Live YTON Table</span>
                      </button>

                      <button
                        onClick={() => {
                          bouzoukiEngine.playMelody('uptempo_anthem');
                        }}
                        className="px-5 py-3.5 rounded-xl bg-[#171b26] text-stone-200 hover:text-white border border-[#2e374d] hover:border-[#d4af37]/60 text-sm font-semibold flex items-center gap-2 hover:bg-[#202636] transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                        <span>Listen to "Thelo Na Me Nioseis"</span>
                      </button>

                      <button
                        onClick={() => setShowWallet(true)}
                        className="px-4 py-3.5 rounded-xl bg-[#11141d] text-stone-300 hover:text-white border border-[#232733] text-sm font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 text-[#38bdf8]" />
                        <span>My Tickets ({userTickets.length})</span>
                      </button>
                    </div>

                    {/* Authenticity Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#232733]/80">
                      <div>
                        <span className="font-mono text-2xl font-black text-white">200M+</span>
                        <span className="text-[11px] text-stone-400 block">YouTube Views Record</span>
                      </div>
                      <div>
                        <span className="font-mono text-2xl font-black text-[#e5c158]">20+ Yrs</span>
                        <span className="text-[11px] text-stone-400 block">Stardom in Greece & Global</span>
                      </div>
                      <div>
                        <span className="font-mono text-2xl font-black text-white">15x</span>
                        <span className="text-[11px] text-stone-400 block">Multi-Platinum Releases</span>
                      </div>
                      <div>
                        <span className="font-mono text-2xl font-black text-emerald-400">100%</span>
                        <span className="text-[11px] text-stone-400 block">Verified & Authorized</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Visual Card */}
                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl shadow-black/80 group">
                      <img
                        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80"
                        alt="Nikos Vertis Live at YTON"
                        className="w-full aspect-[4/5] object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                            YTON Athens Residency Live Now
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-2xl text-white">
                          "The Music Show" Athens
                        </h3>
                        <p className="text-xs text-stone-300 mt-1">
                          Petrou Ralli 38 • Every Saturday & Sunday with 25-piece live bouzouki orchestra & rotating waterfalls.
                        </p>

                        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                          <span className="text-xs font-mono text-[#e5c158]">
                            Tables from €85/person
                          </span>
                          <button
                            onClick={() => setActiveTab('bookings')}
                            className="text-xs font-bold text-black bg-[#d4af37] px-3.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#e5c158]"
                          >
                            <span>Reserve Now</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Core Pillars Overview Cards */}
            <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-1">
                  Comprehensive Celebrity Ecosystem
                </span>
                <h2 className="font-display text-3xl font-extrabold text-white">
                  Exclusive Fan Privileges & Services
                </h2>
                <p className="text-sm text-stone-400 mt-2">
                  Designed for seamless live bookings, private acoustic access, and authentic connections.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pillar 1: Live Event Bookings */}
                <div 
                  onClick={() => setActiveTab('bookings')}
                  className="bg-[#11141d] border border-[#232733] hover:border-[#d4af37] rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-[#d4af37]/10 cursor-pointer group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors">
                      YTON Live Bookings
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      Instant stage-front table reservations at YTON Athens with guaranteed flower tray packages (Garifalla) and Moët champagne service.
                    </p>
                  </div>
                  <span className="mt-5 text-xs font-bold text-[#d4af37] flex items-center gap-1">
                    <span>Explore Dates & Map</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Pillar 2: Exclusive Vault */}
                <div 
                  onClick={() => setActiveTab('vault')}
                  className="bg-[#11141d] border border-[#232733] hover:border-[#d4af37] rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-[#d4af37]/10 cursor-pointer group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Film className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors">
                      Exclusive Vault
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      Stream 4K soundboard multi-camera concerts, acoustic bouzouki masterclasses, and unreleased studio demo takes.
                    </p>
                  </div>
                  <span className="mt-5 text-xs font-bold text-[#d4af37] flex items-center gap-1">
                    <span>Watch Backstage Stream</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Pillar 3: Personalized Interactions */}
                <div 
                  onClick={() => setActiveTab('interactions')}
                  className="bg-[#11141d] border border-[#232733] hover:border-[#d4af37] rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-[#d4af37]/10 cursor-pointer group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors">
                      Personalized Fan AI
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      Order custom video shoutouts spoken and sung by Nikos Vertis, or chat in real-time with the Digital Backstage Concierge.
                    </p>
                  </div>
                  <span className="mt-5 text-xs font-bold text-[#d4af37] flex items-center gap-1">
                    <span>Request Video Shoutout</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Pillar 4: Discussion Board */}
                <div 
                  onClick={() => setActiveTab('community')}
                  className="bg-[#11141d] border border-[#232733] hover:border-[#d4af37] rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-[#d4af37]/10 cursor-pointer group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors">
                      Community Boards
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      Connect with global Vertis fans, discuss song translations, share concert photos, and see verified announcements.
                    </p>
                  </div>
                  <span className="mt-5 text-xs font-bold text-[#d4af37] flex items-center gap-1">
                    <span>Join Discussion</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </section>

            {/* Dynamic Live Setlist & Stage Teleprompter */}
            <LiveSetlistSection onOpenBooking={() => setActiveTab('bookings')} />

            {/* Featured Track Showcase & Bouzouki Preview */}
            <section className="py-12 bg-[#0e1017] border-y border-[#232733]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#141824] border border-[#d4af37]/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#d4af37] flex-shrink-0 relative group">
                      <img
                        src={SONGS_DATA[0].coverUrl}
                        alt="Thelo Na Me Nioseis"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setCurrentTrack(SONGS_DATA[0]);
                          bouzoukiEngine.playMelody('uptempo_anthem');
                        }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/30 transition-colors cursor-pointer"
                      >
                        <Play className="w-8 h-8 text-[#d4af37] fill-[#d4af37]" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#d4af37]/20 text-[#e5c158] font-bold px-2 py-0.5 rounded-full uppercase">
                          Featured Historic Masterpiece
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          215M+ Views Record
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                        Thelo Na Me Nioseis (Θέλω Να Με Νιώσεις)
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 max-w-xl">
                        Composed by Kyriakos Papadopoulos with lyrics by Ilias Filippou. The first Greek music video to ever cross 100M and 200M views in history.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setCurrentTrack(SONGS_DATA[0]);
                        bouzoukiEngine.playMelody('uptempo_anthem');
                      }}
                      className="px-5 py-3 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs flex items-center gap-2 hover:bg-[#e5c158] cursor-pointer shadow-md"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>Play Bouzouki Solo</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 3. Live Event Bookings Tab */}
        {activeTab === 'bookings' && (
          <BookingSection onStartCheckout={handleStartBookingCheckout} />
        )}

        {/* 4. Exclusive Vault Tab */}
        {activeTab === 'vault' && (
          <ExclusiveContentSection user={user} onUpgradeTier={handleUpgradeTier} />
        )}

        {/* 5. Community Discussion Board Tab */}
        {activeTab === 'community' && (
          <CommunityBoard user={user} />
        )}

        {/* 6. Personalized Fan Interactions & AI Tab */}
        {activeTab === 'interactions' && (
          <PersonalizedInteractions user={user} onOrderShoutout={handleOrderShoutout} />
        )}
      </main>

      {/* 7. Persistent Audio Player Bar */}
      <AudioPlayerBar
        currentTrack={currentTrack}
        playlist={SONGS_DATA}
        onSelectTrack={(track) => setCurrentTrack(track)}
      />

      {/* 8. Secure Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        orderData={checkoutOrderData}
        onSuccess={handlePaymentSuccess}
      />

      {/* 9. Verified Credentials Modal */}
      <VerifiedModal
        isOpen={isVerifiedModalOpen}
        onClose={() => setIsVerifiedModalOpen(false)}
      />

      {/* 10. User Tickets Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-[#d4af37]/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-display font-bold text-white text-lg">
                  My Verified Passes & Tickets ({userTickets.length})
                </h3>
              </div>
              <button
                onClick={() => setShowWallet(false)}
                className="w-7 h-7 rounded-full bg-[#202534] text-stone-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1">
              {userTickets.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-[#171b26] to-[#0f121a] border border-[#d4af37]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-bold text-sm text-white">{t.title}</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      {t.venueName} • <strong className="text-stone-300">{t.date}</strong>
                    </p>
                    <span className="font-mono text-[11px] text-[#e5c158] block">
                      Code: {t.bookingCode} • Paid: €{t.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-12 h-12 text-black" />
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-lg bg-[#202636] hover:bg-[#2d364c] text-stone-200 text-xs flex items-center gap-1 cursor-pointer"
                      title="Print Pass"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#232733] flex justify-end">
              <button
                onClick={() => setShowWallet(false)}
                className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs hover:bg-[#e5c158]"
              >
                Close Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
