import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Music, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Gift, 
  MessageSquare,
  Volume2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { UserProfile, PersonalizedDedicationRequest } from '../types';
import { SONGS_DATA } from '../data/vertisData';

interface PersonalizedInteractionsProps {
  user: UserProfile;
  onOrderShoutout: (request: PersonalizedDedicationRequest) => void;
}

export const PersonalizedInteractions: React.FC<PersonalizedInteractionsProps> = ({
  user,
  onOrderShoutout
}) => {
  const [subTab, setSubTab] = useState<'shoutout' | 'backstage_chat' | 'lottery'>('shoutout');

  // Shoutout Form State
  const [recipientName, setRecipientName] = useState('Maria & Giorgos');
  const [senderName, setSenderName] = useState(user.name);
  const [occasion, setOccasion] = useState<PersonalizedDedicationRequest['occasion']>('Wedding');
  const [language, setLanguage] = useState<'English' | 'Greek' | 'Dutch'>('Greek');
  const [dedicationSong, setDedicationSong] = useState(SONGS_DATA[1].title); // An Eisai Ena Asteri
  const [personalNotes, setPersonalNotes] = useState('They fell in love listening to your concerts and are huge fans!');
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'vertis_ai'; text: string; time: string }>>([
    {
      sender: 'vertis_ai',
      text: `Καλησπέρα ${user.name}! Welcome to the Official Nikos Vertis Digital Backstage. I'm connected straight to the YTON team. Ask me anything about our concert preparations, song lyrics, bouzouki solos, or request a custom Greek dedication message!`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // Backstage Pass Lottery state
  const [lotteryEntered, setLotteryEntered] = useState(false);

  // Generate Script using backend Gemini AI
  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/fan-ai/generate-shoutout-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          occasion,
          dedicationSong,
          language,
          personalNote: personalNotes
        })
      });
      const data = await res.json();
      setGeneratedScript(data.script || '');
    } catch (err) {
      setGeneratedScript(`[Nikos Vertis smiling backstage at YTON holding his acoustic guitar]\n\n"Γεια σας ${recipientName}! Εδώ ο Νίκος Βέρτης από τα παρασκήνια του YTON. Σας εύχομαι ολόψυχα για το ${occasion} σας να είστε πάντα ευτυχισμένοι, ερωτευμένοι και γεμάτοι υγεία! Σας αφιερώνω το '${dedicationSong}' με όλη μου την αγάπη. Στην υγειά σας και σας περιμένω σύντομα στο YTON!"`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Send message to Backstage Concierge
  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const query = customMsg || chatInput;
    if (!query.trim() || isChatSending) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatSending(true);

    try {
      const res = await fetch('/api/fan-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          fanName: user.name,
          language: language === 'Greek' ? 'el' : 'en'
        })
      });

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'vertis_ai',
          text: data.reply || 'Thank you for your warm message! See you at YTON!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'vertis_ai',
          text: `Σε ευχαριστώ ${user.name}! Στο YTON The Music Show ετοιμάζουμε πάντα αξέχαστες βραδιές γεμάτες πάθος, ζωντανό μπουζούκι και αυθεντική διασκέδαση. Ανυπομονώ να τα πούμε στη σκηνή!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleOrderVideoShoutout = () => {
    const request: PersonalizedDedicationRequest = {
      id: `shout-${Date.now()}`,
      recipientName,
      senderName,
      occasion,
      language,
      dedicationSong,
      personalNotes,
      deliveryDate: 'Within 48 hours (HD Video Link + Certificate)',
      status: 'Ready to Order',
      generatedScript: generatedScript || 'Authentic video greeting recorded by Nikos Vertis',
      price: 180
    };

    onOrderShoutout(request);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#232733] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#e5c158] text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#e5c158]" />
            Official Artist-to-Fan Connection
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Personalized Fan Interactions
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Order certified custom video shoutouts from Nikos Vertis with acoustic song dedications, or chat live with the official digital backstage concierge.
          </p>
        </div>

        {/* Subtab navigation */}
        <div className="flex items-center gap-1.5 bg-[#12151f] p-1.5 rounded-xl border border-[#232733]">
          <button
            onClick={() => setSubTab('shoutout')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'shoutout'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Celebrity Video Dedication</span>
          </button>

          <button
            onClick={() => setSubTab('backstage_chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'backstage_chat'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Digital Backstage Concierge</span>
          </button>

          <button
            onClick={() => setSubTab('lottery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'lottery'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Meet & Greet Draw</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CELEBRITY VIDEO SHOUTOUT */}
      {subTab === 'shoutout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-7 bg-[#11141d] border border-[#232733] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#232733] pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Request Personalized Video Message
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Recorded backstage at YTON by Nikos Vertis with an acoustic song snippet
                </p>
              </div>
              <span className="text-sm font-bold font-mono text-[#e5c158] bg-[#1a1f2c] px-3 py-1 rounded-full border border-[#d4af37]/30">
                €180 Flat Fee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Recipient Name(s) *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#232733] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="e.g. Maria & Giorgos"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Your Name (Sender) *
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#232733] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Occasion *
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as any)}
                  className="w-full bg-[#0b0d13] border border-[#232733] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Birthday">Birthday (Γενέθλια)</option>
                  <option value="Wedding">Wedding (Γάμος)</option>
                  <option value="Name Day (Γιορτή)">Name Day (Ονομαστική Γιορτή)</option>
                  <option value="Anniversary">Anniversary (Επέτειος)</option>
                  <option value="Graduation">Graduation (Ορκωμοσία)</option>
                  <option value="Personal Encouragement">Personal Encouragement / Motivation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Acoustic Dedication Song *
                </label>
                <select
                  value={dedicationSong}
                  onChange={(e) => setDedicationSong(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#232733] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {SONGS_DATA.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title} ({s.greekTitle})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Preferred Spoken Language
              </label>
              <div className="flex gap-2">
                {(['Greek', 'English', 'Dutch'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      language === lang
                        ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]'
                        : 'bg-[#0b0d13] border-[#232733] text-stone-400 hover:text-white'
                    }`}
                  >
                    {lang === 'Greek' ? 'Ελληνικά (Greek)' : lang === 'Dutch' ? 'Nederlands (Dutch)' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Personal Notes & Special Details for Nikos
              </label>
              <textarea
                rows={3}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                className="w-full bg-[#0b0d13] border border-[#232733] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                placeholder="Mention personal memories, their favorite Vertis album, or inside jokes to include in the video greeting."
              />
            </div>

            {/* AI Script Preview generator button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="w-full py-3 rounded-xl bg-[#1c2233] border border-[#d4af37]/40 text-[#e5c158] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#252c42] transition-colors cursor-pointer"
              >
                {isGeneratingScript ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini AI is drafting Nikos's spoken script...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Script Preview & Spoken Line</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Video Preview Certificate Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-[#11141d] border-2 border-[#d4af37]/50 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#232733] pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Video Shoutout Package
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  Guaranteed 48H
                </span>
              </div>

              {/* Simulated Video Preview Frame */}
              <div className="relative aspect-video rounded-xl bg-black overflow-hidden border border-[#2a3042] mb-4 group">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80"
                  alt="Nikos Vertis Studio"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-between p-4">
                  <span className="bg-black/60 backdrop-blur-md text-[#e5c158] font-mono text-[10px] px-2 py-1 rounded w-max border border-white/10">
                    REC • 4K PRORES
                  </span>

                  <div>
                    <span className="text-xs font-bold text-white block">
                      Greeting for: {recipientName}
                    </span>
                    <span className="text-[11px] text-[#d4af37]">
                      Dedication: "{dedicationSong}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Generated Script Box */}
              <div className="bg-[#0b0d13] border border-[#232733] rounded-xl p-4 text-xs space-y-2">
                <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center justify-between">
                  <span>Backstage Script Preview:</span>
                  <span className="text-[#38bdf8]">Official Format</span>
                </div>
                <p className="text-stone-300 font-serif italic whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                  {generatedScript ||
                    `Click "Generate AI Script Preview" above to see the customized script Nikos Vertis will deliver in his dressing room with his bouzouki for ${recipientName}.`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#232733] text-[11px] text-stone-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Delivered via private 4K download link + permanent cloud storage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Includes digital Certificate of Authenticity signed by Nikos Vertis</span>
                </div>
              </div>
            </div>

            {/* Order Action Button */}
            <button
              onClick={handleOrderVideoShoutout}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b38f24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Book Video Shoutout (€180)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AI DIGITAL BACKSTAGE CONCIERGE CHAT */}
      {subTab === 'backstage_chat' && (
        <div className="bg-[#11141d] border border-[#232733] rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-[#161a26] border-b border-[#232733] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37]">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-white text-base">
                    Nikos Vertis Digital Backstage Concierge
                  </h3>
                  <span className="bg-[#d4af37]/20 text-[#e5c158] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Official artist concierge • Athens YTON direct assistant
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-400 hidden sm:block">
              Response time: <strong className="text-emerald-400">Instant</strong>
            </div>
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-6 py-2.5 bg-[#0b0d13] border-b border-[#232733] flex overflow-x-auto gap-2 scrollbar-none text-xs">
            {[
              "Tell me about the rotating stage at YTON",
              "Why did 'Thelo Na Me Nioseis' break YouTube records?",
              "What is the tradition of throwing carnation flowers (garifalla)?",
              "Which bouzouki scale do you use in 'An Eisai Ena Asteri'?"
            ].map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, promptText)}
                className="px-3 py-1 rounded-full bg-[#181d2a] hover:bg-[#252c42] text-stone-300 hover:text-white border border-[#2b3144] whitespace-nowrap transition-colors cursor-pointer"
              >
                "{promptText}"
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-gradient-to-b from-[#11141d] to-[#0a0c12]">
            {chatMessages.map((msg, i) => {
              const isVertis = msg.sender === 'vertis_ai';
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${isVertis ? 'justify-start' : 'justify-end'}`}
                >
                  {isVertis && (
                    <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-md">
                      NV
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isVertis
                        ? 'bg-[#181d2a] text-stone-200 border border-[#2e374d]'
                        : 'bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black font-medium shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isVertis ? 'text-stone-500' : 'text-black/60'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {!isVertis && (
                    <div className="w-8 h-8 rounded-full bg-stone-700 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isChatSending && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs">
                  NV
                </div>
                <div className="bg-[#181d2a] border border-[#2e374d] rounded-2xl px-4 py-3 text-xs text-stone-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                  <span>Nikos Vertis Digital Backstage is replying...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#141824] border-t border-[#232733] flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about songs, YTON concerts, bouzouki technique or request a greeting..."
              className="flex-1 bg-[#0b0d13] border border-[#2b3144] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatSending}
              className="px-6 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs flex items-center gap-2 hover:bg-[#e5c158] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MEET & GREET LOTTERY */}
      {subTab === 'lottery' && (
        <div className="bg-[#11141d] border border-[#232733] rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center mx-auto text-[#e5c158]">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Monthly VIP Fan Experience
            </span>
            <h3 className="font-display font-bold text-2xl text-white mt-1">
              YTON Backstage Meet & Greet Pass
            </h3>
            <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto">
              Every month, 3 verified fans and their guest are selected for an all-access dressing room visit with Nikos Vertis, signed tour vinyl, and front-row seating.
            </p>
          </div>

          <div className="bg-[#0b0d13] border border-[#232733] rounded-xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[#1f2433] pb-2">
              <span className="text-stone-400">Current Draw:</span>
              <strong className="text-white">October 2026 Athens Show</strong>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-[#1f2433] pb-2">
              <span className="text-stone-400">Next Selection:</span>
              <span className="font-mono text-[#e5c158]">In 6 Days, 14 Hours</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Your Eligibility:</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified ({user.tier})
              </strong>
            </div>
          </div>

          {lotteryEntered ? (
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 text-xs text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You are successfully entered into the next YTON Backstage Pass draw!</span>
            </div>
          ) : (
            <button
              onClick={() => setLotteryEntered(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Monthly Backstage Draw (Free for Verified Fans)</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
