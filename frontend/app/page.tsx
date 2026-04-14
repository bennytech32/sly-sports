"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [dataYaLigi, setDataYaLigi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  
  // STATE ZA LOGIN NA SLIP BUILDER
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [betslip, setBetslip] = useState<any[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // STATE MPYA YA SLIDER
  const [currentSlide, setCurrentSlide] = useState(0);

  const PENDWA_IDS = [39, 140, 135, 78, 61, 2, 3, 848];

  // DATA ZA SLIDES TATU
  const heroSlides = [
    {
      bg: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')",
      badge: "Daily Predictions",
      titleTop: "Win Big With",
      titleHighlight: "Expert Predictions",
      highlightColor: "from-[#facc15] to-yellow-300",
      desc: "Access highly accurate, data-driven match predictions analyzed by our top-tier AI system. Stop guessing and start winning.",
      btnColor: "from-[#1e61d4] to-[#2563eb]"
    },
    {
      bg: "url('https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2000&auto=format&fit=crop')", 
      badge: "Aviator Signals",
      titleTop: "Hack The",
      titleHighlight: "Aviator Algorithm",
      highlightColor: "from-red-500 to-red-300",
      desc: "Our AI engine scans the Aviator RNG to give you exact cashout multipliers. Stop crashing and multiply your bankroll today.",
      btnColor: "from-red-600 to-red-800"
    },
    {
      bg: "url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=2000&auto=format&fit=crop')", 
      badge: "Live RNG Tracker",
      titleTop: "Dominate The",
      titleHighlight: "Casino Jackpots",
      highlightColor: "from-[#facc15] to-yellow-600",
      desc: "Get real-time alerts on Hot and Cold slot machines. Know exactly when the machine is ready to pay out massive jackpots.",
      btnColor: "from-[#facc15] to-yellow-600"
    }
  ];

  useEffect(() => {
    // 1. ANGALIA LOCAL STORAGE KUONA KAMA AMELOGIN
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }

    // 2. VUTA DATA ZA MECHI KUTOKA KWENYE BACKEND YETU MPYA NDANI YA VERCEL (/api)
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // MODIFICATION: Tumetoa localhost, sasa inasoma moja kwa moja /api/mikeka
        const res = await fetch("/api/mikeka", { cache: "no-store" });
        if (res.ok) {
          let rawData = await res.json();
          
          // ========================================================
          // FIX: KAMA API IMEGOMA (LIMIT AU HAKUNA MECHI) - BACKUP SYSTEM
          // ========================================================
          if (!rawData || rawData.length === 0) {
            rawData = [
              {
                id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png",
                matches: [
                  { id: 901, home: "Arsenal", away: "Aston Villa", status: "20:00", ai_tip: "Home Win (1)", asilimia: "68%" },
                  { id: 902, home: "Chelsea", away: "Everton", status: "22:00", ai_tip: "1X", asilimia: "75%" }
                ]
              },
              {
                id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png",
                matches: [
                  { id: 903, home: "Real Madrid", away: "Sevilla", status: "23:00", ai_tip: "Home Win (1)", asilimia: "82%" },
                  { id: 904, home: "Barcelona", away: "Valencia", status: "21:00", ai_tip: "Over 1.5", asilimia: "88%" }
                ]
              }
            ];
            showToast("Using Backup System (API Limit Reached)");
          }

          let sortedData = rawData.sort((a: any, b: any) => {
            const aIsTop = PENDWA_IDS.includes(a.id);
            const bIsTop = PENDWA_IDS.includes(b.id);
            if (aIsTop && !bIsTop) return -1;
            if (!aIsTop && bIsTop) return 1; 
            return 0; 
          });
          setDataYaLigi(sortedData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // 3. LOGIC YA SLIDER
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);

  }, [heroSlides.length]);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("slyUser");
    setIsLoggedIn(false);
    setUser(null);
    setBetslip([]);
    showToast("Logged out successfully");
  };

  const toggleBetslip = (match: any) => {
    const exists = betslip.find(m => m.id === match.id);
    if (exists) {
      setBetslip(betslip.filter(m => m.id !== match.id));
      showToast("❌ Removed from Slip");
    } else {
      setBetslip([...betslip, match]);
      showToast("✅ Added to Slip");
      if (!isSlipOpen) setIsSlipOpen(true);
    }
  };

  const calculateOdds = () => {
    let tOdds = 1;
    betslip.forEach(m => {
      const prob = parseInt(m.asilimia.replace('%', ''));
      const odds = (100 / prob) * 0.95; 
      tOdds *= (odds < 1.01 ? 1.01 : odds);
    });
    return tOdds.toFixed(2);
  };

  const ligiPendwa = dataYaLigi.filter(l => PENDWA_IDS.includes(l.id));
  const ligiNyingine = dataYaLigi.filter(l => !PENDWA_IDS.includes(l.id));

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black pb-20 md:pb-0 relative">
      
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#1e61d4] text-white px-6 py-3 rounded-md shadow-[0_10px_40px_rgba(30,97,212,0.6)] z-[100] flex items-center gap-3 font-bold text-sm animate-bounce">
          <span className="text-lg">✅</span> {toastMsg}
        </div>
      )}

      {/* HEADER */}
      <header className="bg-[#0d1422] border-b border-[#1c2638] sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-4 max-w-[1500px] mx-auto">
          <Link href="/" className="text-xl md:text-2xl font-black tracking-wider cursor-pointer flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              <span className="text-[#070b12] font-bold text-xl">S</span>
            </div>
            <span className="hidden xl:block text-white">SLY<span className="text-[#facc15]">TIPS</span></span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-gray-400 uppercase tracking-wider flex-1 justify-center">
            <Link href="/" className="flex items-center gap-1.5 text-white border-b-2 border-[#facc15] pb-1"><span>⚽</span> Sports</Link>
            <Link href="/aviator" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>✈️</span> Aviator</Link>
            <Link href="/casino" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>🎰</span> Casino</Link>
            <Link href="/results" className="flex items-center gap-1.5 hover:text-white transition pb-1"><span>📊</span> Results</Link>
          </nav>

          <div className="flex gap-4 items-center justify-end flex-shrink-0">
            <div className="hidden md:flex relative">
              <input type="text" placeholder="Search teams..." className="w-40 xl:w-56 bg-[#162032] border border-[#26344d] text-sm rounded py-2 px-3 pl-8 text-white focus:outline-none focus:border-[#facc15] transition"/>
              <span className="absolute left-2.5 top-2 text-gray-400">🔍</span>
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block text-[#facc15] font-bold text-sm bg-[#facc15]/10 px-3 py-1.5 rounded border border-[#facc15]/30">
                  👤 Hi, {user?.name.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="bg-red-600/10 text-red-500 border border-red-500/30 px-4 py-1.5 rounded font-bold text-sm hover:bg-red-600 hover:text-white transition whitespace-nowrap">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-gray-300 hover:text-white font-bold text-sm transition">Login</Link>
                <Link href="/register" className="bg-[#1e61d4] text-white px-5 xl:px-6 py-2 rounded font-bold text-sm hover:bg-[#2563eb] transition shadow-md whitespace-nowrap">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION YENYE SLIDER NA PARALLAX EFFECT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        <div className="relative rounded-xl p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group border border-[#1c2638] min-h-[400px]">
          
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: slide.bg }}
            ></div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b12]/95 via-[#070b12]/70 to-[#070b12]/40 z-0"></div>
          
          <div className="relative z-10 flex-1 transition-all duration-700 transform">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-block bg-[#facc15] text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(250,204,21,0.4)] transition-all">
                {heroSlides[currentSlide].badge}
              </span>
              <span className="inline-block border border-[#1e61d4] text-[#5c98ff] text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest bg-[#1e61d4]/20 backdrop-blur-sm">
                Verified Tips
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 leading-tight text-white drop-shadow-lg transition-all">
              {heroSlides[currentSlide].titleTop} <br/> 
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${heroSlides[currentSlide].highlightColor}`}>
                {heroSlides[currentSlide].titleHighlight}
              </span>
            </h1>
            
            <p className="text-gray-200 text-sm md:text-base max-w-xl mb-8 leading-relaxed drop-shadow-md font-medium transition-all">
              {heroSlides[currentSlide].desc}
            </p>
            
            {!isLoggedIn && (
              <div className="flex gap-4">
                <Link href="/register" className={`inline-block bg-gradient-to-r ${heroSlides[currentSlide].btnColor} ${heroSlides[currentSlide].btnColor.includes('facc') ? 'text-black' : 'text-white'} px-8 py-3 rounded-sm uppercase font-black text-sm hover:scale-105 transition transform shadow-lg`}>
                  Create Free Account
                </Link>
              </div>
            )}
          </div>

          <div className="relative z-10 w-full md:w-auto flex-shrink-0 mt-6 md:mt-0">
            <div className="bg-[#162032]/80 backdrop-blur-md p-6 rounded-xl border border-[#26344d] transform md:rotate-2 hover:rotate-0 transition duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full md:w-72">
               <div className="text-center border-b border-[#26344d] pb-4 mb-4">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Live AI Status</p>
                 <p className="text-3xl font-black text-white drop-shadow-md flex items-center justify-center gap-2">
                   <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> Scanning...
                 </p>
               </div>
               <ul className="text-sm text-gray-200 space-y-3 mb-2 font-medium">
                 <li className="flex items-center justify-between"><span>⚽ Sports </span> <span className="text-[#070b12] font-black bg-[#facc15] px-2 rounded text-[10px]">ACTIVE</span></li>
                 <li className="flex items-center justify-between"><span>✈️ Aviator</span> <span className="text-white font-black bg-red-600 px-2 rounded text-[10px]">HACKED</span></li>
                 <li className="flex items-center justify-between opacity-50"><span>🎰 Casino</span> <span className="text-gray-400 text-[10px]">LOCKED</span></li>
               </ul>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-[#facc15] w-8' : 'bg-gray-500/50 w-2 hover:bg-gray-400'}`}
              ></button>
            ))}
          </div>

        </div>
      </div>

      {/* MAIN LAYOUT NA SIDEBAR MPYA YA KIPROFESA */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR YA KIPROFESA */}
        <aside className="hidden lg:block col-span-1 space-y-6">
          
          {/* 1. BET OF THE DAY */}
          <div className="bg-[#0d1422] border border-[#facc15]/30 rounded-xl overflow-hidden shadow-xl">
             <div className="bg-gradient-to-r from-[#facc15] to-yellow-600 p-3 flex justify-between items-center">
                <h3 className="text-[#070b12] font-black text-xs uppercase">⭐ Bet of the Day</h3>
                <span className="bg-[#070b12] text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">98% CONFIDENCE</span>
             </div>
             <div className="p-4 text-center">
                <p className="text-gray-400 text-[10px] uppercase font-bold mb-2">England - Premier League</p>
                <h4 className="text-white font-black text-sm mb-3">Arsenal vs Aston Villa</h4>
                <div className="bg-[#162032] border border-[#26344d] p-2 rounded flex justify-between items-center">
                   <span className="text-xs font-bold text-gray-400">PICK: <span className="text-[#facc15]">Home Win</span></span>
                   <span className="text-xs font-black text-white">1.65</span>
                </div>
             </div>
          </div>

          {/* 2. AI ACCURACY STATS */}
          <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl p-4">
             <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 border-b border-[#1c2638] pb-2">📈 AI Performance</h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span>Win Rate (Last 30 Days)</span>
                      <span className="text-green-500">84.2%</span>
                   </div>
                   <div className="h-1.5 bg-[#162032] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[84%]"></div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                   <div className="bg-[#162032] p-2 rounded border border-[#1c2638]">
                      <span className="block text-[18px] font-black text-white">12</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Win Streak</span>
                   </div>
                   <div className="bg-[#162032] p-2 rounded border border-[#1c2638]">
                      <span className="block text-[18px] font-black text-[#facc15]">450+</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Tips Won</span>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. PREMIUM GAMES MENU */}
          <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl overflow-hidden">
             <div className="bg-[#162032] p-3 border-b border-[#1c2638]">
                <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Premium Channels</h3>
             </div>
             <ul className="text-xs font-bold">
               <Link href="/aviator"><li className="p-4 flex items-center gap-3 border-b border-[#1c2638] hover:bg-[#162032] transition text-gray-300 hover:text-[#facc15]">✈️ Aviator Predictor <span className="ml-auto text-red-500 text-[8px] animate-pulse">● LIVE</span></li></Link>
               <Link href="/casino"><li className="p-4 flex items-center gap-3 border-b border-[#1c2638] hover:bg-[#162032] transition text-gray-300 hover:text-[#facc15]">🎰 Casino Hacks</li></Link>
             </ul>
             <div className="bg-[#162032] p-3 border-y border-[#1c2638]">
                <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Live Standings</h3>
             </div>
             <ul className="text-xs font-bold">
                {!isLoading && ligiPendwa.slice(0, 3).map((ligi: any, index: number) => (
                  <Link key={`standing-${index}`} href={`/standings/${ligi.id}`}>
                    <li className="flex items-center gap-2 text-gray-400 hover:text-white p-3 border-b border-[#1c2638]/50 transition">
                       {ligi.logo ? <img src={ligi.logo} alt="" className="w-4 h-4 object-contain" /> : <span className="text-[10px]">📊</span>}
                       <span className="truncate">{ligi.name}</span>
                    </li>
                  </Link>
                ))}
             </ul>
          </div>

          {/* 4. VIP UPGRADE BANNER */}
          <div className="bg-gradient-to-br from-[#1e61d4] to-[#070b12] border border-[#5c98ff]/30 rounded-xl p-5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>
             <h3 className="text-white font-black text-sm uppercase mb-2 relative z-10">Upgrade to VIP</h3>
             <p className="text-gray-300 text-[10px] mb-4 relative z-10">Get access to 100% Fixed Odds and expert insider info.</p>
             <Link href="/register" className="bg-white text-[#1e61d4] px-4 py-2 rounded font-black text-[10px] uppercase block text-center relative z-10 hover:scale-105 transition">GET ACCESS</Link>
          </div>

          {/* 5. COMMUNITY LINKS */}
          <div className="space-y-2">
             <a href="#" className="flex items-center justify-center gap-2 bg-[#229ED9] text-white py-3 rounded-lg font-black text-xs uppercase shadow-lg shadow-[#229ED9]/20 transition active:scale-95">
                <span>📱</span> Join Telegram Channel
             </a>
             <a href="#" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-black text-xs uppercase shadow-lg shadow-[#25D366]/20 transition active:scale-95">
                <span>💬</span> WhatsApp Expert Group
             </a>
          </div>

        </aside>

        {/* MATCH LIST (KULIA) */}
        <div className="col-span-1 lg:col-span-3">
          
          <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-6 text-sm">
             <Link href="/results" className="whitespace-nowrap px-5 py-2.5 rounded bg-[#0d1422] text-gray-400 border border-[#1c2638] hover:bg-[#162032] transition font-bold">
               ◄ View Yesterday's Results
             </Link>
             <button className="whitespace-nowrap px-6 py-2.5 rounded bg-[#1e61d4] text-white font-black shadow-[0_4px_15px_rgba(30,97,212,0.4)]">
               TODAY'S TIPS
             </button>
          </div>

          <div className="bg-[#0d1422] border border-[#1c2638] rounded-md shadow-sm">
            <div className="bg-[#090d16] p-4 border-b border-[#1c2638] flex justify-between items-center">
               <h2 className="text-lg font-bold text-white uppercase tracking-wide">Verified Predictions</h2>
               <span className="text-xs text-[#5c98ff] font-bold bg-[#1e61d4]/10 px-3 py-1 rounded border border-[#1e61d4]/20">AI Powered</span>
            </div>

            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-[#162032] rounded-md border border-[#26344d] overflow-hidden animate-pulse">
                    <div className="bg-[#090d16] p-3 flex gap-3 items-center border-b border-[#26344d]">
                      <div className="w-4 h-4 bg-[#26344d] rounded-full"></div>
                      <div className="h-3 bg-[#26344d] w-32 rounded"></div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-8 bg-[#26344d] rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : dataYaLigi.length > 0 ? (
              <div className="flex flex-col">
                {ligiPendwa.map((ligi: any, index: number) => (
                  <LeagueSection key={`top-${index}`} ligi={ligi} isLoggedIn={isLoggedIn} showToast={showToast} betslip={betslip} toggleBetslip={toggleBetslip} />
                ))}

                {ligiNyingine.length > 0 && (
                  <details className="group/leagues">
                    <summary className="list-none cursor-pointer bg-[#162032] hover:bg-[#1c2638] text-center py-5 border-t border-[#1c2638] transition font-black text-sm text-[#5c98ff] outline-none">
                      <span className="group-open/leagues:hidden">⬇ VIEW ALL OTHER LEAGUES ({ligiNyingine.length})</span>
                      <span className="hidden group-open/leagues:block">⬆ HIDE OTHER LEAGUES</span>
                    </summary>
                    <div className="flex flex-col bg-[#070b12]">
                      {ligiNyingine.map((ligi: any, index: number) => (
                        <LeagueSection key={`more-${index}`} ligi={ligi} isLoggedIn={isLoggedIn} showToast={showToast} betslip={betslip} toggleBetslip={toggleBetslip} />
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">No matches found for today.</div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING SLIP BUILDER */}
      {betslip.length > 0 && (
        <div className={`fixed bottom-20 md:bottom-10 right-4 md:right-10 w-80 bg-[#0d1422] border border-[#1e61d4] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 transition-transform duration-300 ${isSlipOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}`}>
          <div onClick={() => setIsSlipOpen(!isSlipOpen)} className="bg-[#1e61d4] text-white p-4 rounded-t-xl cursor-pointer flex justify-between items-center font-black uppercase text-sm">
            <span>🎟️ My Slip ({betslip.length})</span>
            <span>{isSlipOpen ? '▼' : '▲'}</span>
          </div>
          <div className="p-4 bg-[#162032] max-h-64 overflow-y-auto">
            {betslip.map((m, i) => (
              <div key={i} className="flex justify-between items-center border-b border-[#26344d] pb-2 mb-2 last:border-0">
                <div className="w-full">
                  <p className="text-[10px] text-gray-400 font-bold leading-tight">{m.home} vs {m.away}</p>
                  <p className="text-xs font-black text-[#facc15]">{m.ai_tip}</p>
                </div>
                <button onClick={() => toggleBetslip(m)} className="text-red-500 text-xs font-black p-2 bg-red-500/10 rounded ml-2 hover:bg-red-500/20">X</button>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[#1c2638] bg-[#0d1422] rounded-b-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 font-bold uppercase text-xs">Total Odds</span>
              <span className="text-2xl font-black text-[#facc15]">{calculateOdds()}</span>
            </div>
            
            {isLoggedIn ? (
              <div className="mt-2 border-t border-[#26344d] pt-3">
                <p className="text-center text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-widest">Recommended Bookmaker</p>
                <div className="bg-[#162032] border border-[#1e61d4] rounded-lg p-3 mb-3 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white text-xs">1X</div>
                    <div>
                      <p className="text-white font-bold text-xs">1xBet</p>
                      <p className="text-[#facc15] font-black text-sm">CODE: SLY89K</p>
                    </div>
                  </div>
                  <button onClick={() => showToast("Booking Code Copied!")} className="text-gray-400 hover:text-white bg-[#0d1422] p-2 rounded transition active:scale-95">📋</button>
                </div>
                <a href="https://1xbet.com" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white py-2.5 rounded font-black uppercase text-sm hover:shadow-[0_0_15px_rgba(30,97,212,0.5)] transition">
                  Bet Now on 1xBet
                </a>
                <p className="text-[9px] text-center text-gray-500 mt-2">Don't have an account? Sign up to use this code.</p>
              </div>
            ) : (
              <Link href="/login" className="block text-center w-full bg-red-600/90 hover:bg-red-600 text-white py-2.5 rounded font-black uppercase text-sm transition">
                Login to Save Slip
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* FOOTER */}
      <footer className="bg-[#090d16] border-t border-[#1c2638] py-8 mt-10 text-center mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500 text-xs max-w-xl mx-auto leading-relaxed">
            Sly Sports Tips provides expert sports predictions, Aviator signals, and Casino strategies. 
            This is not a gambling site. Must be 18+ to use our services. Please play responsibly.
          </p>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0d1422] border-t border-[#1c2638] flex justify-around items-center py-3 px-2 z-[90] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
         <Link href="/" className="flex flex-col items-center text-[#facc15] gap-1">
           <span className="text-xl">🏠</span>
           <span className="text-[9px] font-black uppercase">Home</span>
         </Link>
         <Link href="/aviator" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1 relative">
           <span className="text-xl">✈️</span>
           <span className="text-[9px] font-bold uppercase">Aviator</span>
           <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
         </Link>
         <Link href="/casino" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1">
           <span className="text-xl">🎰</span>
           <span className="text-[9px] font-bold uppercase">Casino</span>
         </Link>
         {isLoggedIn ? (
           <div onClick={handleLogout} className="flex flex-col items-center text-red-500 hover:text-red-400 transition gap-1 cursor-pointer">
             <span className="text-xl">🚪</span>
             <span className="text-[9px] font-bold uppercase">Logout</span>
           </div>
         ) : (
           <Link href="/register" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1">
             <span className="text-xl">👑</span>
             <span className="text-[9px] font-bold uppercase">VIP</span>
           </Link>
         )}
      </nav>
    </main>
  );
}

// COMPONENT YA KUCHORA LIGI
function LeagueSection({ ligi, isLoggedIn, showToast, betslip, toggleBetslip }: { ligi: any, isLoggedIn: boolean, showToast: any, betslip: any[], toggleBetslip: any }) {
  return (
    <div className="border-b border-[#1c2638] last:border-0 bg-[#0d1422]">
      <Link href={`/standings/${ligi.id}`}>
        <div className="flex items-center gap-3 bg-[#162032] px-4 py-3 border-b border-[#1c2638] cursor-pointer hover:bg-[#1c2638] transition group">
          {ligi.logo ? <img src={ligi.logo} alt={ligi.name} className="w-5 h-5 object-contain" loading="lazy" /> : <span className="text-sm">⚽</span>}
          <h2 className="font-bold text-xs md:text-sm uppercase tracking-wide text-gray-200 group-hover:text-white">{ligi.country} - {ligi.name}</h2>
          <span className="ml-auto text-[10px] text-[#5c98ff] opacity-0 group-hover:opacity-100 transition">View Standings →</span>
        </div>
      </Link>
      <div className="flex flex-col divide-y divide-[#1c2638]/50">
        {ligi.matches?.map((mkeka: any) => (
          <MatchRow key={mkeka.id} mkeka={mkeka} isLoggedIn={isLoggedIn} showToast={showToast} betslip={betslip} toggleBetslip={toggleBetslip} />
        ))}
      </div>
    </div>
  );
}

// COMPONENT YA KUCHORA MECHI
function MatchRow({ mkeka, isLoggedIn, showToast, betslip, toggleBetslip }: { mkeka: any, isLoggedIn: boolean, showToast: any, betslip: any[], toggleBetslip: any }) {
  const inSlip = betslip.find((m: any) => m.id === mkeka.id);

  return (
    <details className="group hover:bg-[#111a2a] transition duration-200">
      <summary className="list-none cursor-pointer p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between outline-none select-none gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
            <span className={`${mkeka.status === 'FT' ? 'text-gray-500' : 'text-[#facc15]'}`}>{mkeka.status}</span>
            <span>|</span><span>ID: {mkeka.id}</span>
          </div>
          <h4 className="font-bold text-sm text-gray-200 truncate">{mkeka.home}</h4>
          <h4 className="font-bold text-sm text-gray-200 truncate">{mkeka.away}</h4>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {isLoggedIn ? (
             <>
              <div onClick={(e) => { e.preventDefault(); showToast("Tip copied!"); }} className="w-20 bg-[#162032] rounded-sm p-1.5 text-center border border-[#26344d] group-hover:border-[#1e61d4] transition active:scale-95">
                <span className="block text-[9px] text-gray-500 uppercase font-bold mb-0.5">Pick</span>
                <span className="block font-black text-[#facc15] text-[11px] truncate">{mkeka.ai_tip}</span>
              </div>
              <button onClick={(e) => { e.preventDefault(); toggleBetslip(mkeka); }} className={`px-4 py-2.5 rounded font-black text-xs transition ${inSlip ? 'bg-red-500 text-white' : 'bg-[#1e61d4] text-white hover:bg-[#2563eb]'}`}>
                {inSlip ? "- Remove" : "+ Add"}
              </button>
             </>
          ) : (
            <>
              <div className="w-20 bg-[#162032] rounded-sm p-1.5 text-center border border-[#26344d]">
                <span className="block text-[9px] text-gray-500 uppercase font-bold mb-0.5">Pick</span>
                <span className="block font-black text-gray-600 text-[11px]">🔒🔒🔒</span>
              </div>
              <Link href="/login" onClick={(e) => e.stopPropagation()} className="bg-red-500/10 text-red-500 border border-red-500/50 px-3 py-2 rounded text-xs font-black flex items-center gap-1 hover:bg-red-500 hover:text-white transition">
                <span>🔒</span> Unlock
              </Link>
            </>
          )}
          <div className="text-gray-500 ml-1 md:ml-3 group-open:rotate-180 transition-transform hidden sm:block">▼</div>
        </div>
      </summary>

      <div className="px-4 pb-4 pt-1 bg-[#090d16] border-t border-[#1c2638]/50 shadow-inner">
        {isLoggedIn ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <h5 className="text-[#facc15] text-[9px] font-bold uppercase tracking-widest mb-1.5">System Analysis</h5>
              <p className="text-gray-400 text-[11px] leading-relaxed">Based on historical data and current form, our expert system identifies strong value in this selection.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-5 text-center mt-2 bg-[#162032]/50 border border-[#26344d] rounded-md">
            <span className="text-3xl mb-2">🔒</span>
            <h5 className="text-[#facc15] text-xs font-bold uppercase tracking-widest mb-2">Analysis Locked</h5>
            <p className="text-gray-400 text-xs max-w-md mx-auto mb-4 leading-relaxed">Create a free account to read the full expert analysis and detailed head-to-head stats.</p>
            <Link href="/register" className="bg-[#1e61d4] text-white px-8 py-2 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-[#2563eb] transition shadow-md">Register to Read</Link>
          </div>
        )}
      </div>
    </details>
  );
}