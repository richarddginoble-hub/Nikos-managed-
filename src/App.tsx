import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  LogIn,
  LogOut,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserPlus,
} from 'lucide-react';

type AuthMode = 'login' | 'signup';
type Session = {
  id: string;
  name: string;
  email: string;
  paid: boolean;
};

type UserRecord = Session & {
  password: string;
};

const AUTH_STORAGE_KEY = 'nikos-vertis-auth-session';
const USERS_STORAGE_KEY = 'nikos-vertis-users';

function readSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function saveSession(session: Session | null) {
  if (typeof window === 'undefined') return;
  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function readUsers(): UserRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

function saveUsers(users: UserRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function makeId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function App() {
  const [session, setSession] = useState<Session | null>(() => readSession());
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [showAuth, setShowAuth] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [notice, setNotice] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleChange = (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleAuthSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNotice('');

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();
    const trimmedPassword = form.password.trim();

    if (!trimmedEmail || !trimmedPassword || (authMode === 'signup' && !trimmedName)) {
      setNotice('Please complete every field before continuing.');
      return;
    }

    const users = readUsers();

    if (authMode === 'signup') {
      if (users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
        setNotice('An account already exists for that email. Please log in instead.');
        return;
      }

      const newUser: UserRecord = {
        id: makeId(),
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        paid: false,
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);

      const nextSession: Session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        paid: false,
      };

      setSession(nextSession);
      setShowAuth(false);
      setNotice('Account created. Secure payment is required before the platform is unlocked.');
      return;
    }

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === trimmedEmail && user.password === trimmedPassword,
    );

    if (!existingUser) {
      setNotice('Invalid email or password. Please create an account or use a valid login.');
      return;
    }

    const nextSession: Session = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      paid: existingUser.paid,
    };

    setSession(nextSession);
    setShowAuth(false);
    setNotice(existingUser.paid ? 'Welcome back. Your access is active.' : 'Welcome back. Your secure payment is still required.');
  };

  const handleSecurePayment = () => {
    if (!session) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const users = readUsers();
      const existingUser = users.find((user) => user.email.toLowerCase() === session.email.toLowerCase());

      if (existingUser) {
        existingUser.paid = true;
        saveUsers(users);
      }

      const nextSession: Session = {
        ...session,
        paid: true,
      };

      setSession(nextSession);
      setIsProcessingPayment(false);
      setNotice('Secure payment verified. Access unlocked.');
    }, 1200);
  };

  const handleLogout = () => {
    setSession(null);
    setShowAuth(false);
    setNotice('You have been logged out.');
  };

  if (!session) {
    return (
      <LandingPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        form={form}
        onChange={handleChange}
        onSubmit={handleAuthSubmit}
        notice={notice}
        setNotice={setNotice}
      />
    );
  }

  if (!session.paid) {
    return (
      <PaymentGate
        session={session}
        isProcessing={isProcessingPayment}
        onRetryPayment={handleSecurePayment}
        onLogout={handleLogout}
        notice={notice}
      />
    );
  }

  return <ProtectedDashboard session={session} onLogout={handleLogout} />;
}

type AuthPanelProps = {
  authMode: AuthMode;
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>;
  showAuth: boolean;
  setShowAuth: React.Dispatch<React.SetStateAction<boolean>>;
  form: { name: string; email: string; password: string };
  onChange: (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  notice: string;
  setNotice: React.Dispatch<React.SetStateAction<string>>;
};

function AuthPanel({
  authMode,
  setAuthMode,
  showAuth,
  setShowAuth,
  form,
  onChange,
  onSubmit,
  notice,
  setNotice,
}: AuthPanelProps) {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#2a3142] bg-[#111827] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#1d2231] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#e5c158]">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Access
            </div>
            <h2 className="text-2xl font-bold text-white">
              {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
          </div>
          <button
            onClick={() => setShowAuth(false)}
            className="rounded-full border border-[#2e374d] px-3 py-1.5 text-xs text-slate-300 transition hover:border-[#d4af37] hover:text-white"
          >
            Back
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#0f172a] p-1.5">
          <button
            onClick={() => {
              setAuthMode('signup');
              setNotice('');
            }}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              authMode === 'signup' ? 'bg-[#d4af37] text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => {
              setAuthMode('login');
              setNotice('');
            }}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              authMode === 'login' ? 'bg-[#d4af37] text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            Log in
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Full name</span>
              <input
                value={form.name}
                onChange={onChange('name')}
                className="w-full rounded-xl border border-[#2a3142] bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]"
                placeholder="Alex Johnson"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={onChange('email')}
              className="w-full rounded-xl border border-[#2a3142] bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]"
              placeholder="fan@nikosvertis.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={onChange('password')}
              className="w-full rounded-xl border border-[#2a3142] bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]"
              placeholder="••••••••"
            />
          </label>

          {notice && <p className="text-sm text-[#f5d98a]">{notice}</p>}

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#e4c15a]"
          >
            {authMode === 'signup' ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {authMode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LandingPage({
  authMode,
  setAuthMode,
  showAuth,
  setShowAuth,
  form,
  onChange,
  onSubmit,
  notice,
  setNotice,
}: AuthPanelProps) {
  if (showAuth) {
    return (
      <AuthPanel
        authMode={authMode}
        setAuthMode={setAuthMode}
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        notice={notice}
        setNotice={setNotice}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <header className="border-b border-[#1d2332] bg-[#101623]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#e5c158] ring-1 ring-[#d4af37]/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Nikos Vertis</div>
              <div className="text-sm font-semibold text-slate-200">Official Fan Platform</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="rounded-xl border border-[#2a3142] px-4 py-2 text-sm text-slate-200 transition hover:border-[#d4af37] hover:text-white"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuth(true);
              }}
              className="rounded-xl bg-[#d4af37] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#e2c867]"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-[#232b3d] bg-gradient-to-br from-[#111827] via-[#0d1118] to-[#0b0c10]">
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d4af37]/15 blur-[120px]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/35 bg-[#121a2a] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#f0d88e]">
                <ShieldCheck className="h-4 w-4" /> Verified fan access
              </div>

              <h1 className="max-w-xl text-5xl font-black tracking-tight text-white md:text-6xl">
                Live music. <span className="text-[#d4af37]">Exclusive experiences.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                Unlock backstage access, premium bookings, fan-only experiences, and private event privileges for the official Nikos Vertis community.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuth(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-bold text-black transition hover:bg-[#e3c768]"
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuth(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2a3142] px-6 py-3 font-bold text-slate-200 transition hover:border-[#d4af37] hover:text-white"
                >
                  Log in
                </button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-left">
                <div className="rounded-2xl border border-[#1d2332] bg-[#101725] p-4">
                  <div className="text-2xl font-black text-white">200M+</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">views</div>
                </div>
                <div className="rounded-2xl border border-[#1d2332] bg-[#101725] p-4">
                  <div className="text-2xl font-black text-[#d4af37]">YTON</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Athens</div>
                </div>
                <div className="rounded-2xl border border-[#1d2332] bg-[#101725] p-4">
                  <div className="text-2xl font-black text-emerald-400">24/7</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">support</div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#d4af37]/40 bg-[#111827] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="rounded-[24px] border border-[#2a3142] bg-gradient-to-br from-[#0d1118] to-[#111827] p-5">
                <div className="flex items-center justify-between rounded-2xl border border-[#2a3142] bg-[#0b0f18] p-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Premium plan</div>
                    <div className="mt-1 text-3xl font-black text-white">$25<span className="text-base text-slate-400">/month</span></div>
                  </div>
                  <div className="rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d88e]">
                    Most popular
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    'Priority booking access',
                    'Backstage content vault',
                    'Exclusive fan AI concierge',
                    'Secure payment protection',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-[#1d2332] bg-[#0f172a] px-3 py-2.5 text-sm text-slate-200">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuth(true);
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#e4c15a]"
                >
                  Unlock premium access <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37]">Why fans join</div>
            <h2 className="mt-3 text-3xl font-black text-white">Everything you need to feel connected to the live experience</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Verified bookings',
                description: 'Secure event tickets and premium tables for live YTON shows with clear booking confirmation.',
                icon: Ticket,
              },
              {
                title: 'Secure checkout',
                description: 'Payment is required before premium content access is granted, protecting the platform from unauthorized views.',
                icon: CreditCard,
              },
              {
                title: 'Private access',
                description: 'Fans receive a protected dashboard and premium-only content once authentication and payment are complete.',
                icon: Lock,
              },
            ].map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-3xl border border-[#1d2332] bg-[#101725] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#e5c158]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PaymentGate({
  session,
  isProcessing,
  onRetryPayment,
  onLogout,
  notice,
}: {
  session: Session;
  isProcessing: boolean;
  onRetryPayment: () => void;
  onLogout: () => void;
  notice: string;
}) {
  return (
    <div className="min-h-screen bg-[#090b12] px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-[#d4af37]/40 bg-[#111827] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#1d2231] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5c158]">
          <Lock className="h-3.5 w-3.5" /> Secure checkout required
        </div>

        <h1 className="text-4xl font-black text-white">Complete payment to unlock access</h1>
        <p className="mt-4 text-slate-300">
          Hello {session.name}. Your account is ready, but premium content and access are protected until a secure payment is confirmed.
        </p>

        <div className="mt-8 rounded-2xl border border-[#2a3142] bg-[#0f172a] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Access package</div>
              <div className="mt-2 text-3xl font-black text-white">Premium Fan Pass</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Total</div>
              <div className="text-3xl font-black text-[#d4af37]">$25</div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-200">
            {[
              'Verified member dashboard',
              'Backstage content vault',
              'Priority bookings and fan rewards',
              'Protected access to all premium features',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {notice && <p className="mt-5 text-sm text-[#f5d98a]">{notice}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onRetryPayment}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 font-bold text-black transition hover:bg-[#e4c15a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard className="h-4 w-4" />
            {isProcessing ? 'Verifying payment…' : 'Complete secure payment'}
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a3142] px-5 py-3 font-semibold text-slate-200 transition hover:border-[#d4af37] hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedDashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const memberPerks = useMemo(
    () => [
      'Verified premium access',
      'Exclusive YTON booking priority',
      'Backstage content vault',
      'Personalized AI concierge',
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <header className="border-b border-[#1d2332] bg-[#111827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Verified Member</div>
            <div className="text-lg font-bold text-white">{session.name}</div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a3142] px-4 py-2 text-sm text-slate-200 transition hover:border-[#d4af37] hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 rounded-[28px] border border-[#2a3142] bg-gradient-to-r from-[#141d30] via-[#101827] to-[#0d1118] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#1d2231] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0d88e]">
                <ShieldCheck className="h-3.5 w-3.5" /> Access unlocked
              </div>
              <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Welcome to your fan portal</h1>
              <p className="mt-4 max-w-xl text-slate-300">
                Your secure checkout has been confirmed. The premium VIP dashboard is now active.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/35 bg-[#d4af37]/10 px-4 py-3 text-sm font-semibold text-[#f0d88e]">
              Status: Active Premium Member
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Live bookings', value: '5 tables', accent: 'text-[#d4af37]' },
            { title: 'Ticket wallet', value: '2 active', accent: 'text-emerald-400' },
            { title: 'Fan points', value: '4,900', accent: 'text-sky-400' },
            { title: 'AI concierge', value: 'Ready', accent: 'text-rose-400' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-[#1d2332] bg-[#101725] p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.title}</div>
              <div className={`mt-3 text-3xl font-black ${item.accent}`}>{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#1d2332] bg-[#101725] p-6">
            <div className="mb-4 text-xs uppercase tracking-[0.25em] text-[#d4af37]">Your member perks</div>
            <div className="space-y-4">
              {memberPerks.map((perk) => (
                <div key={perk} className="flex items-center gap-3 rounded-2xl border border-[#1d2332] bg-[#0d1118] p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#e5c158]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-slate-200">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#1d2332] bg-[#101725] p-6">
            <div className="mb-4 text-xs uppercase tracking-[0.25em] text-[#d4af37]">Account details</div>
            <div className="space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl border border-[#1d2332] bg-[#0d1118] p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Name</div>
                <div className="mt-2 font-semibold text-white">{session.name}</div>
              </div>
              <div className="rounded-2xl border border-[#1d2332] bg-[#0d1118] p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
                <div className="mt-2 font-semibold text-white">{session.email}</div>
              </div>
              <div className="rounded-2xl border border-[#1d2332] bg-[#0d1118] p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Member level</div>
                <div className="mt-2 font-semibold text-[#d4af37]">Premium Fan</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
