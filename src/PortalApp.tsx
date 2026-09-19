import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, CreditCard, Headphones, Lock, LogIn, LogOut, Music, ShieldCheck, Sparkles, Ticket, UserPlus, Wallet } from 'lucide-react';

type Category = 'Celebrity Activity' | 'Live Bookings' | 'Music & Lyrics' | 'Backstage Vault' | 'Fan Community';
type Session = { id: string; name: string; email: string; paid: boolean; categories: Category[]; walletAddress?: string };
type UserRecord = Session & { password: string };

type WindowWithEthereum = Window & {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
};

const SESSION_KEY = 'nikos-vertis-auth-session';
const USERS_KEY = 'nikos-vertis-users';
const CATEGORY_MASKS: Record<Category, number> = {
  'Celebrity Activity': 1,
  'Live Bookings': 2,
  'Music & Lyrics': 4,
  'Backstage Vault': 8,
  'Fan Community': 16,
};
const categories: { name: Category; description: string; icon: React.ElementType }[] = [
  { name: 'Celebrity Activity', description: 'Updates, appearances, announcements, and artist activity.', icon: Sparkles },
  { name: 'Live Bookings', description: 'YTON tables, event tickets, and verified booking access.', icon: Ticket },
  { name: 'Music & Lyrics', description: 'Song previews, lyrics, translations, and music stories.', icon: Music },
  { name: 'Backstage Vault', description: 'Exclusive concerts, acoustic sessions, and private content.', icon: Headphones },
  { name: 'Fan Community', description: 'Discussions, fan stories, and official announcements.', icon: ShieldCheck },
];

function loadSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
function loadUsers(): UserRecord[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function persistSession(session: Session | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}
function persistUsers(users: UserRecord[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function id() { return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function getMask(selected: Category[]) { return selected.reduce((total, category) => total + (CATEGORY_MASKS[category] || 0), 0); }

export default function PortalApp() {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showAuth, setShowAuth] = useState(false);
  const [selected, setSelected] = useState<Category[]>(() => session?.categories || []);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [processing, setProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(session?.walletAddress || null);

  useEffect(() => { persistSession(session); }, [session]);
  useEffect(() => { if (session) setSelected(session.categories || []); }, [session]);
  useEffect(() => { if (session) setWalletAddress(session.walletAddress || null); }, [session]);

  const walletConnect = async () => {
    const provider = (window as WindowWithEthereum).ethereum;
    if (!provider) {
      setNotice('A wallet provider such as MetaMask is required for blockchain payment.');
      return;
    }

    try {
      const result = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const address = result?.[0];
      if (!address) {
        setNotice('Wallet connection was cancelled.');
        return;
      }
      setWalletAddress(address);
      if (session) {
        setSession({ ...session, walletAddress: address });
      }
      setNotice('Wallet connected successfully.');
    } catch (error) {
      setNotice('Wallet connection failed. Please approve the request in your wallet.');
    }
  };

  const submitAuth = (event: React.FormEvent) => {
    event.preventDefault();
    const name = form.name.trim(); const email = form.email.trim().toLowerCase(); const password = form.password.trim();
    if (!email || !password || (mode === 'signup' && !name)) return setNotice('Please complete every field.');
    const users = loadUsers();
    if (mode === 'signup') {
      if (users.some((user) => user.email === email)) return setNotice('An account already exists for this email.');
      const user: UserRecord = { id: id(), name, email, password, paid: false, categories: [], walletAddress: undefined };
      persistUsers([...users, user]); setSession({ id: user.id, name, email, paid: false, categories: [], walletAddress: undefined });
      setShowAuth(false); setNotice('Account created. Choose your interests to continue.'); return;
    }
    const user = users.find((item) => item.email === email && item.password === password);
    if (!user) return setNotice('Invalid email or password.');
    setSession({ id: user.id, name: user.name, email: user.email, paid: user.paid, categories: user.categories || [], walletAddress: user.walletAddress });
    setShowAuth(false); setNotice('Welcome back.');
  };

  const toggleCategory = (category: Category) => {
    setSelected((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  };

  const continueToPayment = () => {
    if (!session || selected.length === 0) return setNotice('Choose at least one category before continuing to payment.');
    setSession({ ...session, categories: selected, walletAddress: walletAddress || session.walletAddress });
    setNotice('Your category selection is saved. Please connect a wallet and complete payment to unlock the dashboard.');
  };

  const pay = () => {
    if (!session || selected.length === 0) return setNotice('Choose at least one category first.');
    if (!walletAddress) return setNotice('Connect a wallet before completing the blockchain payment.');

    setProcessing(true);
    window.setTimeout(() => {
      const users = loadUsers(); const user = users.find((item) => item.id === session.id);
      const mask = getMask(selected);
      if (user) {
        user.paid = true;
        user.categories = selected;
        user.walletAddress = walletAddress;
        persistUsers(users);
      }
      setSession({ ...session, paid: true, categories: selected, walletAddress });
      setProcessing(false);
      setNotice(`Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} verified. Access unlocked with category mask ${mask}.`);
    }, 900);
  };

  if (!session) return <Landing mode={mode} setMode={setMode} showAuth={showAuth} setShowAuth={setShowAuth} form={form} setForm={setForm} submit={submitAuth} notice={notice} />;
  if (!session.paid) return <MemberDashboard session={session} selected={selected} toggle={toggleCategory} continueToPayment={continueToPayment} pay={pay} processing={processing} walletAddress={walletAddress} connectWallet={walletConnect} logout={() => setSession(null)} notice={notice} />;
  return <MemberDashboard session={session} selected={selected} toggle={toggleCategory} continueToPayment={continueToPayment} pay={pay} processing={processing} walletAddress={walletAddress} connectWallet={walletConnect} logout={() => setSession(null)} notice={notice} unlocked />;
}

function Header({ onLogin, onSignup, logout }: { onLogin?: () => void; onSignup?: () => void; logout?: () => void }) {
  return <header className="border-b border-[#1d2332] bg-[#101623]/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#e5c158]"><Sparkles className="h-5 w-5" /></div><div><div className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Nikos Vertis</div><div className="text-sm font-semibold text-slate-200">Official Fan Platform</div></div></div><div className="flex gap-3">{logout ? <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-[#2a3142] px-4 py-2 text-sm text-slate-200"><LogOut className="h-4 w-4" /> Log out</button> : <><button onClick={onLogin} className="rounded-xl border border-[#2a3142] px-4 py-2 text-sm text-slate-200">Log in</button><button onClick={onSignup} className="rounded-xl bg-[#d4af37] px-4 py-2 text-sm font-bold text-black">Sign up</button></>}</div></div></header>;
}

function Auth({ mode, setMode, form, setForm, submit, notice, close }: { mode: 'login' | 'signup'; setMode: (mode: 'login' | 'signup') => void; form: { name: string; email: string; password: string }; setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>; submit: (event: React.FormEvent) => void; notice: string; close: () => void }) {
  return <div className="min-h-screen bg-[#0b0c10] px-4 py-16 text-white"><div className="mx-auto max-w-md rounded-3xl border border-[#2a3142] bg-[#111827] p-8"><div className="mb-6 flex items-start justify-between"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5c158]"><ShieldCheck className="h-3.5 w-3.5" /> Verified access</div><h1 className="text-2xl font-bold">{mode === 'signup' ? 'Create your account' : 'Log in'}</h1></div><button onClick={close} className="text-sm text-slate-400">Back</button></div><div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[#0f172a] p-1"><button onClick={() => setMode('signup')} className={`rounded-lg py-2 text-sm ${mode === 'signup' ? 'bg-[#d4af37] text-black' : 'text-slate-300'}`}>Sign up</button><button onClick={() => setMode('login')} className={`rounded-lg py-2 text-sm ${mode === 'login' ? 'bg-[#d4af37] text-black' : 'text-slate-300'}`}>Log in</button></div><form onSubmit={submit} className="space-y-4">{mode === 'signup' && <input value={form.name} onChange={(e) => setForm((old) => ({ ...old, name: e.target.value }))} placeholder="Full name" className="w-full rounded-xl border border-[#2a3142] bg-[#0f172a] px-4 py-3 text-sm outline-none focus:border-[#d4af37]" />}<input type="email" value={form.email} onChange={(e) => setForm((old) => ({ ...old, email: e.target.value }))} placeholder="Email address" className="w-full rounded-xl border border-[#2a3142] bg-[#0f172a] px-4 py-3 text-sm outline-none focus:border-[#d4af37]" /><input type="password" value={form.password} onChange={(e) => setForm((old) => ({ ...old, password: e.target.value }))} placeholder="Password" className="w-full rounded-xl border border-[#2a3142] bg-[#0f172a] px-4 py-3 text-sm outline-none focus:border-[#d4af37]" />{notice && <p className="text-sm text-[#f5d98a]">{notice}</p>}<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-3 font-bold text-black">{mode === 'signup' ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}{mode === 'signup' ? 'Create account' : 'Log in'}</button></form></div></div>;
}

function Landing({ mode, setMode, showAuth, setShowAuth, form, setForm, submit, notice }: { mode: 'login' | 'signup'; setMode: (mode: 'login' | 'signup') => void; showAuth: boolean; setShowAuth: (show: boolean) => void; form: { name: string; email: string; password: string }; setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>; submit: (event: React.FormEvent) => void; notice: string }) {
  if (showAuth) return <Auth mode={mode} setMode={setMode} form={form} setForm={setForm} submit={submit} notice={notice} close={() => setShowAuth(false)} />;
  const open = (next: 'login' | 'signup') => { setMode(next); setShowAuth(true); };
  return <div className="min-h-screen bg-[#0b0c10] text-white"><Header onLogin={() => open('login')} onSignup={() => open('signup')} /><main><section className="relative overflow-hidden border-b border-[#232b3d] bg-gradient-to-br from-[#111827] via-[#0d1118] to-[#0b0c10]"><div className="mx-auto max-w-7xl px-6 py-24"><div className="max-w-2xl"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d88e]"><ShieldCheck className="h-4 w-4" /> Verified fan access</div><h1 className="text-5xl font-black md:text-6xl">Your official <span className="text-[#d4af37]">fan dashboard.</span></h1><p className="mt-6 text-lg leading-8 text-slate-300">Choose the experiences you love, connect your wallet, complete blockchain-secured payment, and unlock your personalized Nikos Vertis fan portal.</p><button onClick={() => open('signup')} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-bold text-black">Get started <ArrowRight className="h-4 w-4" /></button></div></div></section><section className="mx-auto max-w-7xl px-6 py-16"><h2 className="text-center text-3xl font-black">One dashboard for every fan experience</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{categories.slice(0, 3).map(({ name, description, icon: Icon }) => <div key={name} className="rounded-3xl border border-[#1d2332] bg-[#101725] p-6"><Icon className="h-6 w-6 text-[#d4af37]" /><h3 className="mt-4 text-xl font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{description}</p></div>)}</div></section></main></div>;
}

function MemberDashboard({ session, selected, toggle, continueToPayment, pay, processing, walletAddress, connectWallet, logout, notice, unlocked = false }: { session: Session; selected: Category[]; toggle: (category: Category) => void; continueToPayment: () => void; pay: () => void; processing: boolean; walletAddress: string | null; connectWallet: () => Promise<void>; logout: () => void; notice: string; unlocked?: boolean }) {
  const mask = getMask(selected);
  return <div className="min-h-screen bg-[#0b0c10] text-white"><Header logout={logout} /><main className="mx-auto max-w-7xl px-6 py-10"><div className="rounded-[28px] border border-[#2a3142] bg-gradient-to-r from-[#141d30] to-[#0d1118] p-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0d88e]"><ShieldCheck className="h-3.5 w-3.5" /> {unlocked ? 'Access unlocked' : 'Member dashboard'}</div><h1 className="mt-4 text-4xl font-black md:text-5xl">Welcome, {session.name}</h1><p className="mt-3 max-w-2xl text-slate-300">{unlocked ? 'Your personalized premium dashboard is active.' : 'Choose your categories, connect a wallet, and complete the blockchain-secured payment before unlocking.'}</p></div>{unlocked && <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">Premium member</div>}</div></div><section className="mt-10"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">Personalize your access</div><h2 className="mt-2 text-3xl font-black">Choose your categories</h2></div><div className="text-sm text-slate-400">{selected.length} selected • mask {mask}</div></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{categories.map(({ name, description, icon: Icon }) => { const active = selected.includes(name); return <button key={name} onClick={() => toggle(name)} className={`rounded-3xl border p-6 text-left transition ${active ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#1d2332] bg-[#101725] hover:border-[#56617a]'}`}><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#e5c158]"><Icon className="h-5 w-5" /></span>{active && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}</div><h3 className="mt-5 text-lg font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{description}</p></button>; })}</div></section>{!unlocked ? <section className="mt-10 rounded-3xl border border-[#d4af37]/35 bg-[#111827] p-6"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><div className="flex items-center gap-2 text-[#e5c158]"><Lock className="h-4 w-4" /> Wallet + payment required</div><h2 className="mt-2 text-2xl font-bold">Unlock your selected dashboard</h2><p className="mt-2 text-sm text-slate-300">Your selected categories will be available after a wallet is connected and blockchain payment is confirmed.</p></div><div className="flex flex-wrap gap-3"><button onClick={connectWallet} className="inline-flex items-center gap-2 rounded-xl border border-[#2a3142] px-4 py-3 font-semibold text-slate-200"><Wallet className="h-4 w-4" />{walletAddress ? `Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect wallet'}</button><button onClick={pay} disabled={processing || !walletAddress} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 font-bold text-black disabled:opacity-60">{processing ? 'Verifying payment…' : <><CreditCard className="h-4 w-4" /> Confirm blockchain payment</>}</button></div></div>{notice && <p className="mt-4 text-sm text-[#f5d98a]">{notice}</p>}</section> : <section className="mt-10 grid gap-5 md:grid-cols-3">{selected.map((category) => <div key={category} className="rounded-2xl border border-[#1d2332] bg-[#101725] p-5"><h3 className="font-bold text-[#f0d88e]">{category}</h3><p className="mt-2 text-sm text-slate-300">Your personalized {category.toLowerCase()} area is ready.</p></div>)}</section>}</main></div>;
}
