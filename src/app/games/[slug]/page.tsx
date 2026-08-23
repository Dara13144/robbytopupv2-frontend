'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import GameIcon from '../../../components/GameIcon';
import { fetchProduct, lookupNickname, createOrder, GameProduct, GamePackage, API_BASE } from '../../../lib/api';
import { Gamepad2, ArrowLeft, ShieldAlert, CheckCircle, CreditCard, ShoppingCart, ShieldCheck, Gem, X, Layers } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';

// --- PREMIUM SVG GRAPHICS FOR RECHARGE PACKAGES ---
const DiamondPileIcon = () => (
  <svg className="h-9 w-11 text-cyan-400 shrink-0" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6L34 16L24 26L14 16L24 6Z" fill="url(#gemGrad)" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 18L18 24L12 30L6 24L12 18Z" fill="url(#gemGrad)" stroke="#22d3ee" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8"/>
    <path d="M36 18L42 24L36 30L30 24L36 18Z" fill="url(#gemGrad)" stroke="#22d3ee" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8"/>
    <defs>
      <linearGradient id="gemGrad" x1="24" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06b6d4" stopOpacity="0.4"/>
        <stop stopColor="#3b82f6" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
  </svg>
);

const EvoCardIcon = ({ days }: { days: string }) => (
  <div className="relative flex items-center justify-center shrink-0">
    <svg className="h-9 w-12 text-rose-500" viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="52" height="32" rx="6" fill="url(#cardGrad)" stroke="#f43f5e" strokeWidth="1.5"/>
      <path d="M8 8H24V14H8V8Z" fill="#fda4af" opacity="0.3"/>
      <path d="M8 20H48V22H8V20Z" fill="#f43f5e" opacity="0.5"/>
      <defs>
        <linearGradient id="cardGrad" x1="28" y1="2" x2="28" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e11d48"/>
          <stop stopColor="#4c0519"/>
        </linearGradient>
      </defs>
    </svg>
    <span className="absolute text-[7px] font-black text-rose-100 tracking-wider font-sans select-none">{days}</span>
  </div>
);

const PassChestIcon = ({ type }: { type: string }) => (
  <div className="relative flex items-center justify-center shrink-0">
    <svg className="h-9 w-11 text-amber-500" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14H42V32H6V14Z" fill="url(#chestGrad)" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M4 14C4 10 8 8 24 8C40 8 44 10 44 14H4Z" fill="url(#lidGrad)" stroke="#f59e0b" strokeWidth="1.5"/>
      <circle cx="24" cy="18" r="3" fill="#fef08a" stroke="#d97706" strokeWidth="1"/>
      <defs>
        <linearGradient id="chestGrad" x1="24" y1="14" x2="24" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b45309"/>
          <stop stopColor="#f59e0b" stopOpacity="0.8"/>
        </linearGradient>
        <linearGradient id="lidGrad" x1="24" y1="8" x2="24" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b"/>
          <stop stopColor="#78350f"/>
        </linearGradient>
      </defs>
    </svg>
    <span className="absolute -bottom-1 right-0 text-[6px] font-extrabold bg-slate-950 border border-slate-900 text-amber-400 px-1 py-0.2 rounded-md scale-90">{type}</span>
  </div>
);

const getPackageIcon = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes('evo3d') || norm.includes('3d') || norm.includes('3 day')) return <EvoCardIcon days="3 DAY" />;
  if (norm.includes('evo7d') || norm.includes('7d') || norm.includes('7 day')) return <EvoCardIcon days="7 DAY" />;
  if (norm.includes('evo30d') || norm.includes('30d') || norm.includes('30 day')) return <EvoCardIcon days="30 DAY" />;
  if (norm.includes('weeklylite') || norm.includes('weekly-lite')) return <PassChestIcon type="LITE" />;
  if (norm.includes('weekly')) return <PassChestIcon type="WEEK" />;
  if (norm.includes('monthly')) return <PassChestIcon type="MONTH" />;
  if (norm.includes('pass')) return <PassChestIcon type="PASS" />;
  return <DiamondPileIcon />;
};

export default function GameDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [product, setProduct] = useState<GameProduct | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ABA' | 'BAKONG' | 'CANADIA'>('BAKONG');
  const { t } = useLanguage();
  
  // Player credentials inputs
  const [playerId, setPlayerId] = useState('');
  const [playerZoneId, setPlayerZoneId] = useState('');
  const [playerServer, setPlayerServer] = useState('');
  const [nickname, setNickname] = useState('');
  const [lastValidNickname, setLastValidNickname] = useState(''); // Persists even after re-typing
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupSuccess, setLookupSuccess] = useState(false);
  // Extra profile metadata shown in the profile card
  const [playerCountry, setPlayerCountry] = useState('');
  const [lookupTimestamp, setLookupTimestamp] = useState('');


  // Form states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Custom KHQR payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Unwrap params using React.use() or useEffect
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Polling logic for popup modal payment confirmation
  useEffect(() => {
    let intervalId: any = null;
    if (showPaymentModal && activeOrder) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/orders/status/${activeOrder.paymentTxnId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'SUCCESS' || data.status === 'COMPLETED') {
              clearInterval(intervalId);
              // Redirect directly to details on success
              router.push(`/orders/${activeOrder.paymentTxnId}`);
            }
          }
        } catch (err) {
          console.error('Modal verification polling error:', err);
        }
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showPaymentModal, activeOrder, router]);

  useEffect(() => {
    if (!slug) return;

    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch product detail error:', err);
        setError(`Failed to fetch game top-up configurations from "${API_BASE}". Details: ${err.message || err}`);
        setLoading(false);
      });
  }, [slug]);
  const handleLookup = async () => {
    if (!playerId.trim()) {
      setLookupError(t.nicknameRequired || 'Player ID is required');
      return;
    }
    const isMLBB = slug === 'mobile-legends' || slug.startsWith('mobile-legends-');
    if (isMLBB && !playerZoneId.trim()) {
      setLookupError(t.zoneIdRequired || 'Zone ID (Server ID) is required for Mobile Legends');
      return;
    }

    setLookupError('');
    setLookupSuccess(false);
    setPlayerCountry('');
    setLookupLoading(true);

    try {
      const fetchedNickname = await lookupNickname(slug, playerId.trim(), playerZoneId.trim() || undefined);
      setNickname(fetchedNickname);
      setLastValidNickname(fetchedNickname);
      setLookupSuccess(true);
      setLookupTimestamp(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      // Try to detect country from Khmer characters in nickname or slug
      if (slug.includes('khmer') || slug.includes('cambodia') || slug.includes('kh')) {
        setPlayerCountry('Cambodia 🇰🇭');
      } else if (slug.includes('philippines') || slug.includes('ph')) {
        setPlayerCountry('Philippines 🇵🇭');
      }
    } catch (err: any) {
      console.error(err);
      setLookupError(err.message || 'Player ID not found. Please verify your ID and try again.');
    } finally {
      setLookupLoading(false);
    }
  };


  // Auto-verify Player ID after typing pauses (900ms debounce) — works for ALL games
  useEffect(() => {
    if (!playerId.trim()) {
      setNickname('');
      setLookupError('');
      setLookupSuccess(false);
      return;
    }

    const isMLBB = slug === 'mobile-legends' || slug.startsWith('mobile-legends-');
    // For MLBB, wait until Zone ID is also filled before auto-checking
    if (isMLBB && !playerZoneId.trim()) return;

    // Per-game format validation to prevent premature API calls while typing
    if (slug === 'free-fire' || slug.startsWith('free-fire-')) {
      if (!/^\d{5,12}$/.test(playerId.trim())) return;
    } else if (slug === 'pubg-mobile' || slug.startsWith('pubg-mobile-')) {
      if (!/^\d{5,15}$/.test(playerId.trim())) return;
    } else if (slug === 'valorant') {
      if (!playerId.includes('#') || playerId.trim().length < 5) return;
    } else if (isMLBB) {
      if (!/^\d{3,12}$/.test(playerId.trim()) || !/^\d{2,10}$/.test(playerZoneId.trim())) return;
    } else if (slug === 'genshin-impact' || slug === 'honkai-star-rail') {
      if (!/^\d{6,12}$/.test(playerId.trim())) return;
    } else if (slug === 'roblox') {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(playerId.trim())) return;
    } else if (slug === 'steam-voucher') {
      return; // Steam needs no validation
    } else {
      // Generic: wait until at least 3 characters
      if (playerId.trim().length < 3) return;
    }

    const timer = setTimeout(() => {
      handleLookup();
    }, 900);

    return () => clearTimeout(timer);
  }, [playerId, playerZoneId, slug]);

  const handleOrderSubmit = async () => {
    if (!playerId.trim()) {
      setError(t.nicknameRequired || 'Please enter your Player ID');
      return;
    }
    const isMLBB = slug === 'mobile-legends' || slug.startsWith('mobile-legends-');
    if (isMLBB && !playerZoneId.trim()) {
      setError(t.zoneIdRequired || 'Zone ID (Server ID) is required for Mobile Legends');
      return;
    }
    if (!selectedPackage) {
      setError('Please select a top-up package');
      return;
    }

    // Auto-trigger lookup if not yet verified (for all games that support it)
    if (!lookupSuccess && slug !== 'steam-voucher') {
      setError('');
      try {
        await handleLookup();
      } catch (e) {
        // Error state handled inside handleLookup — do not proceed if lookup failed
        return;
      }
      // If after lookup we still failed, stop order
      if (!lookupSuccess) return;
    }

    setError('');
    setOrderSubmitting(true);

    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('user_email') || undefined : undefined;
      const res = await createOrder(
        selectedPackage.id,
        playerId,
        playerZoneId || null,
        paymentMethod,
        email
      );
      
      // Redirect directly to the interactive checkout invoice page
      router.push(`/orders/${res.order.paymentTxnId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit top-up request.');
      setOrderSubmitting(false);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    if (activeOrder) {
      router.push(`/orders/${activeOrder.paymentTxnId}`);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading game modules...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="flex-grow max-w-md w-full mx-auto flex flex-col justify-center py-16 px-4">
          <div className="glass-panel p-8 text-center bg-slate-950 border-slate-900">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-white font-extrabold text-lg mb-2">Game Not Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              The game configuration you requested does not exist or has been disabled.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to games</span>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 text-xs font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToHome}</span>
        </Link>

        {/* Game Intro Banner Card */}
        <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-950 to-slate-900 border-slate-900 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <GameIcon slug={product.slug} className="h-20 w-20" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{product.name}</h1>
            <p className="text-slate-400 text-xs mt-1">
              {t.category}: <span className="text-slate-200 uppercase font-semibold">{product.category.replace('_', ' ')}</span>
              {' '} • {t.instantDelivery}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Steps Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1: Enter Player ID */}
            <div className="glass-panel p-6 bg-slate-950/40 border-slate-900">
              <div className="flex items-center space-x-2 mb-5">
                <span className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  1
                </span>
                <h3 className="text-white font-bold text-base">{t.enterAccountDetails}</h3>
              </div>

              {/* --- Player ID + Zone/Server Input Grid --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Player ID */}
                <div>
                  <label className="block text-slate-400 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">
                    {t.playerId}
                  </label>
                  <div className="relative">
                    <input
                      id="player-id-input"
                      type="text"
                      required
                      placeholder="Enter your Player ID..."
                      value={playerId}
                      onChange={(e) => {
                        setPlayerId(e.target.value);
                        setLookupSuccess(false);
                        setLookupError('');
                        setNickname('');
                      }}
                      className={`w-full pl-4 pr-10 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        lookupSuccess
                          ? 'bg-emerald-950/30 border border-emerald-500/50 text-emerald-200 focus:border-emerald-400'
                          : lookupError
                          ? 'bg-red-950/20 border border-red-500/40 text-red-200 focus:border-red-400'
                          : 'bg-slate-950/70 border border-slate-800 text-slate-200 focus:border-cyan-500/60'
                      } placeholder-slate-600 focus:outline-none`}
                    />
                    {lookupSuccess && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                      </span>
                    )}
                    {lookupError && !lookupLoading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-lg font-bold">✕</span>
                    )}
                  </div>
                </div>

                {/* Zone ID for Mobile Legends */}
                {(product.slug === 'mobile-legends' || product.slug.startsWith('mobile-legends-')) && (
                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">
                      {t.zoneId} (Server ID)
                    </label>
                    <input
                      id="player-zone-input"
                      type="text"
                      placeholder="e.g. 1234"
                      value={playerZoneId}
                      onChange={(e) => {
                        setPlayerZoneId(e.target.value);
                        setLookupSuccess(false);
                        setLookupError('');
                        setNickname('');
                      }}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
                    />
                  </div>
                )}

                {/* Server selector for PUBG, Valorant, Blood Strike etc */}
                {(product.slug === 'pubg-mobile' || product.slug === 'valorant' || product.slug === 'blood-strike' || product.slug === 'honor-of-kings' || product.slug === 'farlight-84' || product.slug === 'delta-force') && (
                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">
                      Game Server / Region
                    </label>
                    <select
                      id="player-server-select"
                      value={playerServer}
                      onChange={(e) => { setPlayerServer(e.target.value); setLookupSuccess(false); setNickname(''); }}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:border-cyan-500/60 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Region --</option>
                      {product.slug === 'pubg-mobile' && (<>
                        <option value="asia">🌏 Asia</option>
                        <option value="sea">🌊 Southeast Asia</option>
                        <option value="eu">🇪🇺 Europe</option>
                        <option value="na">🌎 North America</option>
                        <option value="kr">🇰🇷 Korea/Japan</option>
                      </>)}
                      {product.slug === 'valorant' && (<>
                        <option value="ap">🌏 Asia Pacific</option>
                        <option value="eu">🇪🇺 Europe</option>
                        <option value="na">🌎 North America</option>
                        <option value="latam">🌎 Latin America</option>
                        <option value="br">🇧🇷 Brazil</option>
                      </>)}
                      {(product.slug === 'blood-strike' || product.slug === 'honor-of-kings' || product.slug === 'farlight-84' || product.slug === 'delta-force') && (<>
                        <option value="sea">🌊 Southeast Asia</option>
                        <option value="global">🌐 Global</option>
                        <option value="asia">🌏 Asia</option>
                        <option value="eu">🇪🇺 Europe</option>
                        <option value="na">🌎 North America</option>
                      </>)}
                    </select>
                  </div>
                )}
              </div>

              {/* --- CHECK ID BUTTON --- Shows for ALL games except steam-voucher --- */}
              {product.slug !== 'steam-voucher' && (
                <div className="mt-1">
                  <button
                    id="check-id-btn"
                    type="button"
                    onClick={handleLookup}
                    disabled={lookupLoading || !playerId.trim()}
                    className={`relative w-full py-3 rounded-xl font-extrabold text-sm tracking-wide overflow-hidden transition-all duration-200 ${
                      lookupLoading
                        ? 'bg-slate-800 border border-slate-700 text-slate-400 cursor-wait'
                        : lookupSuccess
                        ? 'bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 active:scale-[0.98]'
                        : lookupError
                        ? 'bg-red-700 border border-red-600 text-white hover:bg-red-600 active:scale-[0.98]'
                        : !playerId.trim()
                        ? 'bg-slate-800/60 border border-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-700 border border-cyan-500/40 text-white hover:from-cyan-500 hover:to-blue-600 active:scale-[0.98] shadow-lg shadow-cyan-900/30'
                    }`}
                  >
                    {/* Shimmer overlay */}
                    {!lookupLoading && !lookupSuccess && !lookupError && playerId.trim() && (
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      {lookupLoading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          <span>កំពុងផ្ទៀងផ្ទាត់ ID...</span>
                        </>
                      ) : lookupSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>✅ ផ្ទៀងផ្ទាត់បានជោគជ័យ — {nickname}</span>
                        </>
                      ) : lookupError ? (
                        <>
                          <span>❌ ព្យាយាមម្ដងទៀត (Retry)</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>🔍 ផ្ទៀងផ្ទាត់ Player ID</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* ═══════════════════════════════════════ GAME ACCOUNT PROFILE CARD ═══════════════════════════════════════ */}
                  {lookupSuccess && nickname && (() => {
                    // Per-game theme config
                    type GameTheme = { from: string; via: string; to: string; accent: string; avatarFrom: string; avatarTo: string; border: string; label: string; icon: string };
                    const gameThemes: Record<string, GameTheme> = {
                      'free-fire':      { from:'from-orange-950', via:'via-red-950',    to:'to-slate-950', accent:'text-orange-400',  avatarFrom:'from-orange-500', avatarTo:'to-red-600',     border:'border-orange-500/30',  label:'Free Fire',       icon:'🔥' },
                      'mobile-legends': { from:'from-blue-950',   via:'via-indigo-950', to:'to-slate-950', accent:'text-blue-400',    avatarFrom:'from-blue-500',   avatarTo:'to-indigo-600',  border:'border-blue-500/30',    label:'Mobile Legends',  icon:'⚔️' },
                      'pubg-mobile':    { from:'from-yellow-950', via:'via-amber-950',  to:'to-slate-950', accent:'text-amber-400',   avatarFrom:'from-amber-500',  avatarTo:'to-yellow-600',  border:'border-amber-500/30',   label:'PUBG Mobile',     icon:'🎯' },
                      'valorant':       { from:'from-rose-950',   via:'via-pink-950',   to:'to-slate-950', accent:'text-rose-400',    avatarFrom:'from-rose-500',   avatarTo:'to-pink-600',    border:'border-rose-500/30',    label:'Valorant',        icon:'🎮' },
                      'genshin-impact': { from:'from-violet-950', via:'via-purple-950', to:'to-slate-950', accent:'text-violet-400',  avatarFrom:'from-violet-500', avatarTo:'to-purple-600',  border:'border-violet-500/30',  label:'Genshin Impact',  icon:'✨' },
                      'honkai-star-rail':{ from:'from-sky-950',   via:'via-cyan-950',   to:'to-slate-950', accent:'text-sky-400',     avatarFrom:'from-sky-500',    avatarTo:'to-cyan-600',    border:'border-sky-500/30',     label:'Honkai Star Rail',icon:'🌟' },
                      'roblox':         { from:'from-red-950',    via:'via-rose-950',   to:'to-slate-950', accent:'text-red-400',     avatarFrom:'from-red-500',    avatarTo:'to-red-700',     border:'border-red-500/30',     label:'Roblox',          icon:'🧱' },
                      'blood-strike':   { from:'from-red-950',    via:'via-rose-950',   to:'to-slate-950', accent:'text-red-400',     avatarFrom:'from-red-600',    avatarTo:'to-rose-700',    border:'border-red-500/30',     label:'Blood Strike',    icon:'💥' },
                      'honor-of-kings': { from:'from-yellow-950', via:'via-amber-950',  to:'to-slate-950', accent:'text-yellow-400',  avatarFrom:'from-yellow-500', avatarTo:'to-amber-600',   border:'border-yellow-500/30',  label:'Honor of Kings',  icon:'👑' },
                      'default':        { from:'from-emerald-950',via:'via-teal-950',   to:'to-slate-950', accent:'text-emerald-400', avatarFrom:'from-emerald-500',avatarTo:'to-teal-600',    border:'border-emerald-500/30', label:product.name,      icon:'🎮' },
                    };
                    const baseSlug = (Object.keys(gameThemes) as string[]).find(k => k !== 'default' && (slug === k || slug.startsWith(k + '-'))) || 'default';
                    const th = gameThemes[baseSlug];

                    // Per-game currency & rank system
                    const gameInfo: Record<string, { currency: string; ranks: string[] }> = {
                      'free-fire':       { currency: 'Diamonds 💎', ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Heroic','Grandmaster'] },
                      'mobile-legends':  { currency: 'Diamonds 💎', ranks: ['Warrior','Elite','Master','Grandmaster','Epic','Legend','Mythic'] },
                      'pubg-mobile':     { currency: 'UC 🪙',        ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Crown','Ace','Conqueror'] },
                      'valorant':        { currency: 'VP 🪙',        ranks: ['Iron','Bronze','Silver','Gold','Platinum','Diamond','Ascendant','Immortal','Radiant'] },
                      'genshin-impact':  { currency: 'Genesis Crystals', ranks: ['AR10','AR20','AR35','AR45','AR55','AR60'] },
                      'honkai-star-rail':{ currency: 'Oneiric Shards',   ranks: ['TL20','TL40','TL60','TL65','TL70'] },
                      'roblox':          { currency: 'Robux 💰',     ranks: ['Starter','Member','Builder','Veteran','Creator'] },
                      'default':         { currency: 'Credits',      ranks: ['Beginner','Intermediate','Advanced','Expert','Master'] },
                    };
                    const info = gameInfo[baseSlug] || gameInfo['default'];
                    const idHash = playerId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                    const rank = info.ranks[idHash % info.ranks.length];

                    return (
                      <div
                        className={`mt-4 rounded-2xl overflow-hidden border ${th.border} shadow-2xl`}
                        style={{ animation: 'fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1)', background: 'rgba(2,6,23,0.95)' }}
                      >
                        {/* ── Hero Banner ── */}
                        <div className={`relative bg-gradient-to-br ${th.from} ${th.via} ${th.to} px-5 pt-5 pb-16 overflow-hidden`}>
                          {/* Glow blobs */}
                          <div className={`absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${th.avatarFrom} ${th.avatarTo} pointer-events-none`} />
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                          {/* Game header row */}
                          <div className="flex items-center gap-2.5 mb-5">
                            <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10">
                              <GameIcon slug={product.slug} className="h-9 w-9" />
                            </div>
                            <div>
                              <p className={`${th.accent} font-black text-[11px] uppercase tracking-[0.12em]`}>{th.icon} {product.name}</p>
                              <p className="text-slate-600 text-[9px] font-semibold uppercase tracking-widest">{product.category === 'MOBILE_GAME' ? 'Mobile Game' : product.category === 'PC_GAME' ? 'PC Game' : 'Game'}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                              <span className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase">Verified</span>
                            </div>
                          </div>

                          {/* Player avatar + name */}
                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${th.avatarFrom} ${th.avatarTo} flex items-center justify-center shadow-2xl ring-4 ring-white/10`}>
                                <span className="text-white font-black text-4xl select-none leading-none drop-shadow-lg">
                                  {nickname.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {/* Animated online pulse */}
                              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-40" />
                                <span className="relative h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm" />
                              </span>
                            </div>

                            {/* Name + rank + country */}
                            <div className="flex flex-col min-w-0">
                              <strong className="text-white font-black text-2xl sm:text-3xl truncate leading-none mb-2 drop-shadow">{nickname}</strong>
                              <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex items-center gap-1 ${th.accent} text-[10px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5`}>
                                  🏅 {rank}
                                </span>
                                {playerCountry && (
                                  <span className="text-slate-400 text-[10px] font-semibold bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">{playerCountry}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── Info Chips — float over banner ── */}
                        <div className="relative -mt-9 mx-3 grid grid-cols-3 gap-2">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 shadow-lg">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Player ID</p>
                            <p className="text-white font-extrabold text-xs truncate">{playerId}</p>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 shadow-lg">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
                              {playerZoneId ? 'Zone ID' : playerServer ? 'Region' : 'Server'}
                            </p>
                            <p className="text-white font-extrabold text-xs truncate uppercase">{playerZoneId || playerServer || 'Global'}</p>
                          </div>
                          <div className="bg-emerald-950/70 border border-emerald-500/25 rounded-xl px-3 py-2.5 shadow-lg">
                            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-0.5">Status</p>
                            <p className="text-emerald-300 font-extrabold text-xs flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 shrink-0" /> Active
                            </p>
                          </div>
                        </div>

                        {/* ── Account Details Grid ── */}
                        <div className="mx-3 mt-3 grid grid-cols-3 divide-x divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                          <div className="text-center px-2 py-3 bg-slate-900/60">
                            <p className={`${th.accent} font-black text-base leading-none mb-1`}>{rank}</p>
                            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Rank</p>
                          </div>
                          <div className="text-center px-2 py-3 bg-slate-900/60">
                            <p className="text-white font-black text-xs leading-snug mb-1">{info.currency}</p>
                            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Top-Up</p>
                          </div>
                          <div className="text-center px-2 py-3 bg-slate-900/60">
                            <p className="text-emerald-400 font-black text-base leading-none mb-1 flex items-center justify-center gap-0.5">
                              <CheckCircle className="h-4 w-4" />
                            </p>
                            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Verified</p>
                          </div>
                        </div>

                        {/* ── Footer bar ── */}
                        <div className="mt-3 bg-slate-900/50 border-t border-slate-800/60 px-4 py-2.5 flex items-center justify-between">
                          <span className="text-slate-500 text-[10px] font-medium">
                            ✅ Account confirmed{lookupTimestamp ? ` at ${lookupTimestamp}` : ''} — choose a package ↓
                          </span>
                          <span className={`${th.accent} text-[10px] font-bold flex items-center gap-1`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                          </span>
                        </div>
                      </div>
                    );
                  })()}



                  {/* --- ERROR CARD --- */}
                  {lookupError && !lookupLoading && (
                    <div
                      className="mt-3 flex items-center gap-3 bg-red-950/30 border border-red-500/40 rounded-xl px-4 py-3"
                      style={{ animation: 'fadeSlideUp 0.3s ease' }}
                    >
                      <span className="text-red-400 text-2xl shrink-0">⚠️</span>
                      <div className="flex flex-col">
                        <span className="text-red-300 font-bold text-xs">Player ID Not Found</span>
                        <span className="text-red-400/80 text-[11px]">{lookupError}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>{/* END STEP 1 */}

            {/* STEP 2: Select Package */}
            <div className="glass-panel p-6 bg-slate-950/40 border-slate-900">
              <div className="flex items-center space-x-2 mb-6">
                <span className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  2
                </span>
                <h3 className="text-white font-bold text-base">{t.selectRechargePackage}</h3>
              </div>

              {/* Helper for package thumbnail icon & card */}
              {(() => {
                const getPkgThumbnail = (pkgName: string) => {
                  const norm = pkgName.toLowerCase();
                  const slugNorm = product.slug.toLowerCase();

                  if (norm.includes('coffee')) {
                    return (
                      <div className="h-full w-full rounded flex items-center justify-center bg-amber-950/40 text-amber-400 text-lg select-none">
                        ☕
                      </div>
                    );
                  }

                  if (norm.includes('evo') || norm.includes('3d') || norm.includes('7d') || norm.includes('30d') || norm.includes('lvp')) {
                    return (
                      <img
                        src="/images/evo-card.jpg"
                        alt="EVO"
                        className="h-full w-full object-cover rounded"
                      />
                    );
                  }

                  if (norm.includes('monthly') || norm.includes('3in1')) {
                    return (
                      <img
                        src="/images/vip-pass.jpg"
                        alt="Pass"
                        className="h-full w-full object-cover rounded"
                      />
                    );
                  }

                  if (norm.includes('weekly') || norm.includes('pass')) {
                    return (
                      <img
                        src="/images/vip-pass.jpg"
                        alt="Pass"
                        className="h-full w-full object-cover rounded"
                      />
                    );
                  }

                  if (slugNorm.includes('pubg') || norm.includes('uc')) {
                    return (
                      <img
                        src="/images/pubg-uc.jpg"
                        alt="UC"
                        className="h-full w-full object-cover rounded"
                      />
                    );
                  }

                  if (slugNorm.includes('valorant') || norm.includes('vp')) {
                    return (
                      <img
                        src="/images/valorant-vp.jpg"
                        alt="VP"
                        className="h-full w-full object-cover rounded"
                      />
                    );
                  }

                  // Default: Diamonds
                  return (
                    <img
                      src="/images/diamonds-chest.jpg"
                      alt="Diamonds"
                      className="h-full w-full object-cover rounded"
                    />
                  );
                };

                const renderCompactCard = (pkg: GamePackage) => {
                  const isSelected = selectedPackage?.id === pkg.id;

                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-left border transition-all duration-200 flex items-center gap-3 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-[#1f2a44] border-amber-400 ring-2 ring-amber-400/90 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-[1.02]'
                          : 'bg-[#182032]/95 border-[#263148] hover:bg-[#202b44] hover:border-[#384869] hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Left Thumbnail Icon */}
                      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-[#101626] border border-slate-700/60 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                        {getPkgThumbnail(pkg.name)}
                      </div>

                      {/* Right Details: Price (Top) & Name (Bottom) */}
                      <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <span className="text-amber-400 font-black text-sm sm:text-base leading-tight tracking-tight drop-shadow-[0_0_6px_rgba(251,191,36,0.25)]">
                          ${pkg.price.toFixed(2)}
                        </span>
                        <span className="text-slate-100 font-bold text-xs sm:text-[13px] leading-tight truncate mt-0.5 group-hover:text-white transition-colors" title={pkg.name}>
                          {pkg.name}
                        </span>
                      </div>

                      {/* Optional Top Right Badge */}
                      {pkg.badge && (
                        <span className="absolute top-1 right-1.5 text-[7px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded uppercase shadow-sm">
                          {pkg.badge}
                        </span>
                      )}
                    </button>
                  );
                };

                const bestSellerPkgs = product.packages.filter(p => p.category === 'BEST_SELLER');
                const normalPkgs = product.packages.filter(p => p.category !== 'BEST_SELLER');

                return (
                  <div className="space-y-8">
                    {/* BEST SELLING SECTION */}
                    {bestSellerPkgs.length > 0 && (
                      <div>
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-[#3b1d28]/70 pb-2.5 mb-4 select-none">
                          <div className="flex items-center space-x-2">
                            <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-black shadow-sm">
                              💎
                            </span>
                            <h3 className="text-sm sm:text-base tracking-wide font-black uppercase">
                              <span className="text-amber-400">BEST</span>{' '}
                              <span className="text-white">SELLING</span>
                            </h3>
                          </div>
                          <span className="bg-[#1e3a8a]/70 text-blue-300 border border-blue-500/40 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            {bestSellerPkgs.length} ITEMS
                          </span>
                        </div>

                        {/* 4-Column Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                          {bestSellerPkgs.map(renderCompactCard)}
                        </div>
                      </div>
                    )}

                    {/* SAVING PACKAGES / ALL PACKAGES SECTION */}
                    {normalPkgs.length > 0 && (
                      <div>
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-[#3b1d28]/70 pb-2.5 mb-4 select-none">
                          <div className="flex items-center space-x-2">
                            <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-black shadow-sm">
                              💎
                            </span>
                            <h3 className="text-sm sm:text-base tracking-wide font-black uppercase">
                              <span className="text-amber-400">SAVING</span>{' '}
                              <span className="text-white">PACKAGES</span>
                            </h3>
                          </div>
                          <span className="bg-[#1e3a8a]/70 text-blue-300 border border-blue-500/40 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            {normalPkgs.length} ITEMS
                          </span>
                        </div>

                        {/* 4-Column Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                          {normalPkgs.map(renderCompactCard)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* STEP 3: Choose Payment Gateway */}
            <div className="glass-panel p-6 bg-slate-950/40 border-slate-900">
              <div className="flex items-center space-x-2 mb-4">
                <span className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  3
                </span>
                <h3 className="text-white font-bold text-base">{t.choosePaymentGateway}</h3>
              </div>

              <div className="grid grid-cols-1 max-w-sm gap-4">
                {/* Bakong KHQR */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BAKONG')}
                  className="p-4 rounded-xl border border-violet-500 bg-violet-950/10 flex items-center space-x-4 transition-all text-left w-full cursor-default"
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                    <img
                      src="/images/payments/bakong.png"
                      alt="Bakong KHQR"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Bakong KHQR</h4>
                    <span className="text-slate-400 text-[10px] leading-tight block mt-0.5">{t.bakongDesc}</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Column 3: Summary Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 bg-slate-950/70 border-slate-900 sticky top-24">
              <h3 className="text-white font-extrabold text-base border-b border-slate-900 pb-3 mb-4 flex items-center space-x-2">
                <ShoppingCart className="h-4.5 w-4.5 text-cyan-400" />
                <span>{t.orderSummary}</span>
              </h3>

              {/* Order Items list details */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.selectedProduct}:</span>
                  <span className="text-white font-bold">{product.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.packageItem}:</span>
                  <span className="text-white font-semibold">{selectedPackage ? selectedPackage.name : 'Not selected'}</span>
                </div>



                {playerId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.playerIdDetails}:</span>
                    <span className="text-white font-mono">
                      {playerId} {playerZoneId ? `(${playerZoneId})` : ''}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">{t.paymentGateway}:</span>
                  <span className="text-white font-bold">{paymentMethod}</span>
                </div>

                <div className="border-t border-slate-900 pt-3 flex justify-between items-end">
                  <span className="text-slate-400 text-sm">{t.totalPriceUsd}:</span>
                  <span className="text-cyan-400 text-xl font-black">
                    ${selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              {/* Global Error Banner */}
              {error && (
                <div className="mt-4 p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-red-300 text-[11px] leading-relaxed">
                  {error}
                </div>
              )}

              {/* Action Submit Checkout */}
              <button
                type="button"
                onClick={handleOrderSubmit}
                disabled={orderSubmitting}
                className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-black text-sm shadow-md transition-all duration-300 glow-btn disabled:opacity-50"
              >
                {orderSubmitting ? t.generatingInvoice : t.purchaseTopUp}
              </button>

              <div className="mt-4 text-center text-[10px] text-slate-500 leading-normal">
                {t.purchaseDisclaimer}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
