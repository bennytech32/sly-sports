"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [dataYaLigi, setDataYaLigi] = useState<{top: any[], more: any[]}>({top: [], more: []});
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  
  // STATE YA KUSEARCH MATCH
  const [searchQuery, setSearchQuery] = useState("");
  
  // STATE ZA LOGIN NA SLIP BUILDER
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [betslip, setBetslip] = useState<any[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  // DYNAMIC STATS NA BET OF THE DAY
  const [betOfTheDay, setBetOfTheDay] = useState<any>(null);
  const [dynamicStats, setDynamicStats] = useState({ winRate: "84.2", streak: 12, total: 452 });

  const PENDWA_IDS = [39, 140, 135, 78, 61, 2, 3, 40, 345, 88, 94]; 

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
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }

    const fetchData = async () => {
      try {
        const cacheBuster = new Date().getTime();
        const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";
        const res = await fetch(`${baseUrl}/api/mikeka?t=${cacheBuster}`, { cache: "no-store" });
        
        if (res.ok) {
          let rawData = await res.json();
          
          if (!rawData || (!rawData.top && !rawData.more) || (rawData.top.length === 0 && rawData.more.length === 0)) {
             setIsLoading(false);
             return;
          }

          setDataYaLigi({
              top: rawData.top || [],
              more: rawData.more || []
          });

          let allMatches: any[] = [];
          const allLeagues = [...(rawData.top || []), ...(rawData.more || [])];
          
          allLeagues.forEach((ligi: any) => {
            if(ligi.matches) {
                const matchesWithLeague = ligi.matches.map((m: any) => ({...m, leagueName: ligi.name, country: ligi.country}));
                allMatches = [...allMatches, ...matchesWithLeague];
            }
          });

          allMatches.sort((a: any, b: any) => parseInt(b.asilimia) - parseInt(a.asilimia));
          
          if (allMatches.length > 0) {
              setBetOfTheDay(allMatches[0]);
          }

          const today = new Date().getDate();
          setDynamicStats({
              winRate: (82 + (today % 5) + Math.random()).toFixed(1),
              streak: 8 + (today % 6),
              total: 450 + today * 2
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

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
    if (betslip.length === 0) return "0.00";
    let tOdds = 1;
    betslip.forEach(m => {
      const prob = parseInt(m.asilimia.replace('%', ''));
      if(prob && prob !== 0){
        const odds = (100 / prob) * 0.95; 
        tOdds *= (odds < 1.01 ? 1.01 : odds);
      }
    });
    return tOdds.toFixed(2);
  };

  // SEARCH LOGIC: Kuchuja mechi kulingana na unachoandika
  const filterLeagues = (leagues: any[]) => {
    if (!searchQuery) return leagues;
    const lowerQuery = searchQuery.toLowerCase();
    return leagues.map(league => {
      // Kama jina la ligi linamatch, onyesha mechi zote
      const isLeagueMatch = league.name?.toLowerCase().includes(lowerQuery) || league.country?.toLowerCase().includes(lowerQuery);
      
      const filteredMatches = league.matches.filter((m: any) => 
        m.home.toLowerCase().includes(lowerQuery) || 
        m.away.toLowerCase().includes(lowerQuery)
      );
      return { ...league, matches: isLeagueMatch ? league.matches : filteredMatches };
    }).filter(league => league.matches.length > 0);
  };

  const filteredTop = filterLeagues(dataYaLigi.top);
  const filteredMore = filterLeagues(dataYaLigi.more);
  const isSearching = searchQuery.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black pb-20 md:pb-0 relative">
      
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#1e61d4] text-white px-6 py-3 rounded-md shadow-[0_10px_40px_rgba(30,97,212,0.6)] z-[100] flex items-center gap-3 font-bold text-sm animate-bounce">
          <span className="text-lg">✅</span> {toastMsg}
        </div>
      )}

      {/* HEADER YENYE OPTION YA OFFICIAL LOGO ILIYOKUZWA */}
      <header className="bg-[#0d1422] border-b border-[#1c2638] sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4 max-w-[1500px] mx-auto">
          
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            {/* LOGO IMEKUZWA (h-14 md:h-16) */}
            <img 
               src="/logo.png" 
               alt="SlyTips Logo" 
               className="h-14 md:h-16 w-auto object-contain" 
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                 if (nextSibling) nextSibling.style.display = 'flex';
               }} 
            />
            {/* Jina la Akiba kama Logo haipo */}
            <div className="hidden items-center gap-2">
              <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                <span className="text-[#070b12] font-bold text-xl">S</span>
              </div>
              <span className="hidden xl:block text-xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">TIPS</span></span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-gray-400 uppercase tracking-wider flex-1 justify-center">
            <Link href="/" className="flex items-center gap-1.5 text-white border-b-2 border-[#facc15] pb-1"><span>⚽</span> Sports</Link>
            <Link href="/aviator" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>✈️</span> Aviator</Link>
            <Link href="/casino" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>🎰</span> Casino</Link>
          </nav>

          <div className="flex gap-4 items-center justify-end flex-shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hidden sm:inline-block text-[#facc15] font-bold text-sm bg-[#facc15]/10 px-4 py-1.5 rounded border border-[#facc15]/30 hover:bg-[#facc15]/20 transition">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="bg-red-600/10 text-red-500 border border-red-500/30 px-4 py-1.5 rounded font-bold text-sm hover:bg-red-600 hover:text-white transition whitespace-nowrap">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-gray-300 hover:text-white font-bold text-sm transition cursor-pointer">Login</Link>
                <Link href="/register" className="bg-[#1e61d4] text-white px-5 xl:px-6 py-2 rounded font-bold text-sm hover:bg-[#2563eb] transition shadow-md whitespace-nowrap cursor-pointer">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        <div className="relative rounded-xl p-8 md:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group border border-[#1c2638] min-h-[350px]">
          {heroSlides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: slide.bg }}></div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b12]/95 via-[#070b12]/70 to-[#070b12]/40 z-0"></div>
          <div className="relative z-10 flex-1 transition-all duration-700">
            <span className="inline-block bg-[#facc15] text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(250,204,21,0.4)] mb-4">{heroSlides[currentSlide].badge}</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight text-white drop-shadow-lg">
              {heroSlides[currentSlide].titleTop} <br/> 
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${heroSlides[currentSlide].highlightColor}`}>{heroSlides[currentSlide].titleHighlight}</span>
            </h1>
            <p className="text-gray-200 text-sm max-w-xl mb-8 leading-relaxed drop-shadow-md font-medium">{heroSlides[currentSlide].desc}</p>
            {!isLoggedIn && (
              <Link href="/register" className={`inline-block bg-gradient-to-r ${heroSlides[currentSlide].btnColor} ${heroSlides[currentSlide].btnColor.includes('facc') ? 'text-black' : 'text-white'} px-8 py-3 rounded-sm uppercase font-black text-sm hover:scale-105 transition transform shadow-lg`}>
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* SIDEBAR YA KIPROFESA */}
        <aside className="hidden xl:block col-span-1 space-y-5">
          
          {/* VIP BANNER */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-[#1e61d4] to-[#070b12] border border-[#5c98ff]/30 rounded-xl p-5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>
               <h3 className="text-white font-black text-sm uppercase mb-2 relative z-10">Upgrade to VIP Status</h3>
               <p className="text-gray-300 text-[10px] mb-4 relative z-10">Get access to 100% Fixed Odds, live algorithms, and expert insider info.</p>
               <Link href="/register" className="bg-white text-[#1e61d4] px-4 py-2 rounded font-black text-[10px] uppercase block text-center relative z-10 hover:scale-105 transition">GET VIP ACCESS</Link>
            </div>
          )}

          {/* BET OF THE DAY */}
          <div className="bg-[#0d1422] border border-[#facc15]/30 rounded-xl overflow-hidden shadow-xl relative">
             <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#facc15]/10 rounded-full blur-2xl"></div>
             <div className="bg-gradient-to-r from-[#facc15] to-yellow-600 p-3 flex justify-between items-center relative z-10">
                <h3 className="text-[#070b12] font-black text-xs uppercase">⭐ Bet of the Day</h3>
                <span className="bg-[#070b12] text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                   {betOfTheDay ? betOfTheDay.asilimia : "WAITING..."}
                </span>
             </div>
             <div className="p-4 text-center relative z-10">
                {betOfTheDay ? (
                    <>
                        <p className="text-gray-400 text-[10px] uppercase font-bold mb-2">{betOfTheDay.leagueName}</p>
                        <h4 className="text-white font-black text-sm mb-3">{betOfTheDay.home} vs {betOfTheDay.away}</h4>
                        <div className="bg-[#162032] border border-[#26344d] p-2 rounded flex justify-between items-center">
                           <span className="text-xs font-bold text-gray-400">PICK: <span className="text-[#facc15]">{betOfTheDay.ai_tip}</span></span>
                        </div>
                    </>
                ) : <p className="text-gray-500 text-xs py-4">Scanning for top picks...</p>}
             </div>
          </div>

          {/* AI STATS */}
          <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl p-4">
             <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 border-b border-[#1c2638] pb-2">📈 AI Performance</h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span>Win Rate (Last 30 Days)</span>
                      <span className="text-green-500">{dynamicStats.winRate}%</span>
                   </div>
                   <div className="h-1.5 bg-[#162032] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: `${dynamicStats.winRate}%`}}></div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                   <div className="bg-[#162032] p-2 rounded border border-[#1c2638]">
                      <span className="block text-[18px] font-black text-white">{dynamicStats.streak}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Win Streak</span>
                   </div>
                   <div className="bg-[#162032] p-2 rounded border border-[#1c2638]">
                      <span className="block text-[18px] font-black text-[#facc15]">{dynamicStats.total}+</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Tips Won</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-2 mt-4">
             <a href="#" className="flex items-center justify-center gap-2 bg-[#229ED9] text-white py-3 rounded-lg font-black text-xs uppercase shadow-lg hover:bg-[#1c8ec7]">
                <span>📱</span> Join Telegram Channel
             </a>
             <a href="#" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-black text-xs uppercase shadow-lg hover:bg-[#20bd5a]">
                <span>💬</span> WhatsApp Expert Group
             </a>
          </div>
        </aside>

        {/* MATCH LIST (KULIA) */}
        <div className="col-span-1 xl:col-span-3">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
             <h2 className="text-xl font-bold text-white uppercase tracking-wide border-l-4 border-[#1e61d4] pl-3">Live Highlights</h2>
             
             {/* PREMIUM SEARCH BAR */}
             <div className="relative w-full md:w-64">
               <input 
                 type="text" 
                 placeholder="Search team or league..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#0d1422] border border-[#1c2638] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#1e61d4] transition placeholder-gray-500"
               />
               <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
             </div>
          </div>

          <div className="bg-[#0d1422] border border-[#1c2638] rounded-md shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-[#1e61d4] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold text-sm animate-pulse">Loading Live Odds...</p>
              </div>
            ) : (filteredTop.length > 0 || filteredMore.length > 0) ? (
              <div className="flex flex-col">
                
                {/* LIGI KUBWA / FILTERED TOP */}
                {filteredTop.map((ligi: any, index: number) => (
                  <LeagueSection key={`top-${index}`} ligi={ligi} isLoggedIn={isLoggedIn} showToast={showToast} betslip={betslip} toggleBetslip={toggleBetslip} />
                ))}

                {/* LIGI NYINGINE (MORE) - Auto open if searching */}
                {filteredMore.length > 0 && (
                   <details className="group/leagues" open={isSearching}>
                     <summary className="list-none cursor-pointer bg-[#090d16] hover:bg-[#111a2a] text-center py-4 border-t border-[#1c2638] transition font-black text-xs uppercase tracking-widest text-[#5c98ff] outline-none">
                       {isSearching ? (
                         <span>Search Results from Other Leagues ({filteredMore.length})</span>
                       ) : (
                         <>
                           <span className="group-open/leagues:hidden">▼ View All Other Leagues ({filteredMore.length})</span>
                           <span className="hidden group-open/leagues:block">▲ Hide Other Leagues</span>
                         </>
                       )}
                     </summary>
                     <div className="flex flex-col bg-[#070b12]">
                       {filteredMore.map((ligi: any, index: number) => (
                         <LeagueSection key={`more-${index}`} ligi={ligi} isLoggedIn={isLoggedIn} showToast={showToast} betslip={betslip} toggleBetslip={toggleBetslip} />
                       ))}
                     </div>
                   </details>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <span className="text-4xl block mb-3 opacity-50">🔍</span>
                <p className="font-bold text-gray-300">No matches found.</p>
                <p className="text-xs mt-2">Try searching a different team or league.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING SLIP BUILDER */}
      {betslip.length > 0 && (
        <div className={`fixed bottom-20 md:bottom-10 right-4 md:right-10 w-80 bg-[#0d1422] border border-[#1e61d4] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 transition-transform duration-300 ${isSlipOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}`}>
          <div onClick={() => setIsSlipOpen(!isSlipOpen)} className="bg-[#1e61d4] text-white p-4 rounded-t-xl cursor-pointer flex justify-between items-center font-black uppercase text-sm">
            <span>🎟️ Betslip ({betslip.length})</span>
            <span>{isSlipOpen ? '▼' : '▲'}</span>
          </div>
          <div className="p-4 bg-[#162032] max-h-64 overflow-y-auto">
            {betslip.map((m, i) => (
              <div key={i} className="flex justify-between items-center border-b border-[#26344d] pb-2 mb-2 last:border-0">
                <div className="w-full">
                  <p className="text-[10px] text-gray-400 font-bold leading-tight">{m.home} vs {m.away}</p>
                  <p className="text-xs font-black text-[#facc15]">{m.ai_tip}</p>
                </div>
                <button onClick={() => toggleBetslip(m)} className="text-gray-500 text-xs font-black p-2 hover:text-red-500">X</button>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[#1c2638] bg-[#0d1422] rounded-b-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-bold uppercase text-xs">Total Odds</span>
              <span className="text-2xl font-black text-white">{calculateOdds()}</span>
            </div>
            
            {isLoggedIn ? (
              <a href="https://1xbet.com" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#facc15] text-[#070b12] py-3 rounded font-black uppercase text-sm hover:bg-yellow-500 transition">
                 Sign In & Bet
              </a>
            ) : (
              <Link href="/login" className="block text-center w-full bg-[#1e61d4] text-white py-3 rounded font-black uppercase text-sm transition hover:bg-[#2563eb]">
                Login to Save Slip
              </Link>
            )}
          </div>
        </div>
      )}

      {/* DISCLAIMER YENYE ONYO LA KAMARI ILIYORUDISHWA */}
      <footer className="bg-[#090d16] border-t border-[#1c2638] py-8 mt-10 text-center mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500 text-xs max-w-xl mx-auto leading-relaxed">
            Sly Sports Tips provides expert sports predictions and AI analysis. 
            <span className="font-bold text-gray-400 block my-2">Sisi hatuusiki na uchezeshaji wa kamari, tunatoa utabiri tu. Tofauti na kampuni za kubeti, sisi haturuhusu kuweka pesa.</span> 
            Must be 18+ to use our services. Please play responsibly.
          </p>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="xl:hidden fixed bottom-0 left-0 w-full bg-[#0d1422] border-t border-[#1c2638] flex justify-around items-center py-3 px-2 z-[90] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
         <Link href="/" className="flex flex-col items-center text-[#facc15] gap-1">
           <span className="text-xl">🏠</span>
           <span className="text-[9px] font-black uppercase">Home</span>
         </Link>
         <Link href="/dashboard" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1">
           <span className="text-xl">📊</span>
           <span className="text-[9px] font-bold uppercase">Dashboard</span>
         </Link>
         {isLoggedIn ? (
           <div onClick={handleLogout} className="flex flex-col items-center text-red-500 hover:text-red-400 transition gap-1 cursor-pointer">
             <span className="text-xl">🚪</span>
             <span className="text-[9px] font-bold uppercase">Logout</span>
           </div>
         ) : (
           <Link href="/login" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1">
             <span className="text-xl">👤</span>
             <span className="text-[9px] font-bold uppercase">Login</span>
           </Link>
         )}
      </nav>
    </main>
  );
}

// =================================================================
// COMPONENTS ZA MUUNDO WA "SPORTODDS" (TABLE-LIKE LAYOUT)
// =================================================================

function LeagueSection({ ligi, isLoggedIn, showToast, betslip, toggleBetslip }: { ligi: any, isLoggedIn: boolean, showToast: any, betslip: any[], toggleBetslip: any }) {
  return (
    <div className="border-b border-[#1c2638] last:border-0 bg-[#0d1422]">
      <div className="flex items-center gap-3 bg-[#111a2a] px-4 py-2 border-b border-[#1c2638]">
        {ligi.logo ? <img src={ligi.logo} alt={ligi.name} className="w-4 h-4 object-contain" loading="lazy" /> : <span className="text-[10px]">⚽</span>}
        <h2 className="font-bold text-[11px] uppercase tracking-wide text-gray-300">{ligi.name}</h2>
      </div>
      
      <div className="hidden md:flex bg-[#090d16] px-4 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-[#1c2638]">
         <div className="flex-1">Match Details</div>
         <div className="w-20 text-center">Status</div>
         <div className="w-24 text-center">Prediction</div>
         <div className="w-20 text-center">Action</div>
      </div>

      <div className="flex flex-col">
        {ligi.matches?.map((mkeka: any) => (
          <MatchRow key={mkeka.id} mkeka={mkeka} isLoggedIn={isLoggedIn} showToast={showToast} betslip={betslip} toggleBetslip={toggleBetslip} />
        ))}
      </div>
    </div>
  );
}

function MatchRow({ mkeka, isLoggedIn, showToast, betslip, toggleBetslip }: { mkeka: any, isLoggedIn: boolean, showToast: any, betslip: any[], toggleBetslip: any }) {
  const inSlip = betslip.find((m: any) => m.id === mkeka.id);

  return (
    <div className="px-4 py-3 border-b border-[#1c2638]/50 hover:bg-[#162032] transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
      
      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
        <span className="text-[9px] md:hidden text-[#facc15] font-bold mb-1">{mkeka.status}</span>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-gray-200 leading-tight">{mkeka.home}</span>
          <span className="font-bold text-sm text-gray-200 leading-tight">{mkeka.away}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between md:justify-end mt-2 md:mt-0">
        
        <div className="hidden md:block w-20 text-center">
          <span className="text-[10px] text-[#facc15] font-bold">{mkeka.status}</span>
        </div>

        <div className="w-28 md:w-24">
          {isLoggedIn ? (
             <div onClick={(e) => { e.preventDefault(); showToast("Tip copied!"); }} className="bg-[#090d16] border border-[#26344d] rounded py-1.5 px-2 text-center cursor-pointer hover:border-[#5c98ff] transition">
                <span className="block font-black text-[#5c98ff] text-[10px] truncate">{mkeka.ai_tip}</span>
             </div>
          ) : (
             <div className="bg-[#090d16] border border-[#26344d] rounded py-1.5 px-2 text-center opacity-70">
                <span className="block font-black text-gray-500 text-[10px]">🔒 VIP ONLY</span>
             </div>
          )}
        </div>

        <div className="w-20 text-right md:text-center">
          {isLoggedIn ? (
             <button onClick={(e) => { e.preventDefault(); toggleBetslip(mkeka); }} className={`w-full py-1.5 rounded font-black text-[10px] transition ${inSlip ? 'bg-transparent border border-red-500 text-red-500' : 'bg-[#1e61d4] text-white hover:bg-[#2563eb]'}`}>
                {inSlip ? "REMOVE" : "+ SLIP"}
             </button>
          ) : (
             <Link href="/login" className="block w-full py-1.5 rounded font-black text-[10px] bg-[#1c2638] text-gray-400 hover:text-white transition text-center border border-[#26344d]">
                LOGIN
             </Link>
          )}
        </div>

      </div>
    </div>
  );
}