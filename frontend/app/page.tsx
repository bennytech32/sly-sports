"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ==========================================
// KAMUSI YA LUGHA
// ==========================================
const translations = {
  en: {
    sports: "Sports", aviator: "Aviator", casino: "Casino", contact: "Contact Us",
    goToDashboard: "Go to Dashboard", logout: "Logout", login: "Login", register: "Register",
    createFreeAccount: "Create Free Account",
    leaguesToday: "🏆 Leagues & Sports",
    allMatches: "🔥 All Matches",
    betOfTheDay: "⭐ Bet of the Day",
    topTenPicks: "💎 Premium Acca Combos",
    loginToView: "🔒 Login to View Premium Acca",
    aiPrediction: "AI Prediction",
    scanningPicks: "Scanning for top picks...",
    joinWhatsApp: "Join VIP WhatsApp Group",
    joinInstagram: "Follow Us on Instagram",
    freeCodes: "Free Codes & Updates",
    dailyTips: "Daily Tips & Slips",
    liveHighlights: "Live Highlights",
    searchPlaceholder: "Search team or league...",
    loadingOdds: "Loading Live Odds...",
    noMatches: "No matches found.",
    trySearching: "Try searching a different team or selecting 'All' leagues.",
    searchResults: "Search Results from Other Leagues",
    viewAllOther: "▼ View All Other Leagues",
    hideOther: "▲ Hide Other Leagues",
    matchDetails: "Match Details",
    status: "Status",
    prediction: "Prediction",
    action: "Action",
    vipOnly: "🔒 Login for AI Pick",
    remove: "REMOVE",
    addSlip: "+ SLIP",
    totalOdds: "Total Odds",
    signInBet: "Select Bookmaker To Bet",
    loginSave: "Login to Save Slip",
    betslip: "Betslip",
    disclaimer: "Sly Sports Tips provides expert sports predictions and AI analysis.",
    disclaimerWarn: "We are not a betting company. We do not accept deposits or handle bets. We only provide expert predictions.",
    disclaimerAge: "18+ Must be 18 years or older to use our services. Please play responsibly.",
    chatHello: "Hello! How can we help you today with our AI Predictions?",
    usefulLinks: "Useful Links",
    quickLinks: "Quick Links"
  },
  sw: {
    sports: "Michezo", aviator: "Aviator", casino: "Kasino", contact: "Wasiliana Nasi",
    goToDashboard: "Nenda Dashibodi", logout: "Toka", login: "Ingia", register: "Jisajili",
    createFreeAccount: "Tengeneza Akaunti Bure",
    leaguesToday: "🏆 Ligi & Michezo",
    allMatches: "🔥 Mechi Zote",
    betOfTheDay: "⭐ Mkeka Wa Leo",
    topTenPicks: "💎 Mikeka ya Uhakika (Combos)",
    loginToView: "🔒 Ingia Kuona Mkeka Huu",
    aiPrediction: "Utabiri wa AI",
    scanningPicks: "Inatafuta mechi bora...",
    joinWhatsApp: "Jiunge na WhatsApp Channel",
    joinInstagram: "Tufuatilie Instagram",
    freeCodes: "Pata Code Bure Kila Siku",
    dailyTips: "Uchambuzi wa Kila Siku",
    liveHighlights: "Mechi Zinazoendelea",
    searchPlaceholder: "Tafuta timu au ligi...",
    loadingOdds: "Inapakua Odds...",
    noMatches: "Hakuna mechi zilizopatikana.",
    trySearching: "Jaribu kutafuta timu nyingine au chagua 'Mechi Zote'.",
    searchResults: "Matokeo Kutoka Ligi Nyingine",
    viewAllOther: "▼ Tazama Ligi Nyingine Zote",
    hideOther: "▲ Ficha Ligi Nyingine",
    matchDetails: "Maelezo Ya Mechi",
    status: "Muda",
    prediction: "Utabiri",
    action: "Tendo",
    vipOnly: "🔒 Ingia Kuona Utabiri",
    remove: "ONDOA",
    addSlip: "+ WEKA",
    totalOdds: "Jumla ya Odds",
    signInBet: "Chagua Kampuni Ya Kubeti",
    loginSave: "Ingia Kuhifadhi Mkeka",
    betslip: "Mkeka Wako",
    disclaimer: "Sly Sports Tips inatoa uchambuzi wa kitaalamu na utabiri wa AI.",
    disclaimerWarn: "Sisi hatuusiki na uchezeshaji wa kamari, tunatoa utabiri tu. Tofauti na kampuni za kubeti, sisi haturuhusu kuweka pesa.",
    disclaimerAge: "18+ Lazima uwe na miaka 18 au zaidi kutumia huduma zetu. Cheza kistaarabu.",
    chatHello: "Jambo! Tukusaidie vipi leo kuhusu Mikeka na Utabiri wetu?",
    usefulLinks: "Viungo Muhimu",
    quickLinks: "Kurasa Zetu"
  }
};

const FALLBACK_LEAGUES = [
  { key: "soccer_epl", name: "Premier League", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { key: "soccer_spain_la_liga", name: "La Liga", icon: "🇪🇸" },
  { key: "soccer_italy_serie_a", name: "Serie A", icon: "🇮🇹" },
  { key: "basketball_nba", name: "NBA Basketball", icon: "🏀" },
  { key: "tennis_atp", name: "ATP Tennis", icon: "🎾" }
];

const getSportIcon = (leagueName: string, defaultIcon?: string) => {
  if (defaultIcon) return defaultIcon;
  if (!leagueName) return "⚽";
  const name = leagueName.toLowerCase();
  if (name.includes("basket") || name.includes("nba")) return "🏀";
  if (name.includes("tennis") || name.includes("wta") || name.includes("atp")) return "🎾";
  if (name.includes("american") || name.includes("nfl")) return "🏈";
  if (name.includes("hockey") || name.includes("nhl")) return "🏒";
  if (name.includes("base") || name.includes("mlb")) return "⚾";
  if (name.includes("rugby")) return "🏉";
  if (name.includes("cricket")) return "🏏";
  if (name.includes("volley")) return "🏐";
  if (name.includes("mma") || name.includes("ufc") || name.includes("boxing")) return "🥊";
  if (name.includes("ping") || name.includes("pong")) return "🏓";
  return "⚽"; 
};

// ==========================================
// PARALLAX BACKGROUND ELEMENTS 🎲
// ==========================================
const PARALLAX_ITEMS = [
  { id: 1, icon: "⚽", left: "5%", top: "2%", speed: 0.3, size: "text-9xl" },
  { id: 2, icon: "🎰", left: "80%", top: "8%", speed: 0.15, size: "text-8xl" },
  { id: 3, icon: "💸", left: "12%", top: "18%", speed: 0.4, size: "text-[10rem]" },
  { id: 4, icon: "🃏", left: "75%", top: "28%", speed: 0.25, size: "text-7xl" },
  { id: 5, icon: "🎲", left: "8%", top: "40%", speed: 0.5, size: "text-9xl" },
  { id: 6, icon: "🏆", left: "85%", top: "50%", speed: 0.2, size: "text-8xl" },
  { id: 7, icon: "🎯", left: "15%", top: "65%", speed: 0.35, size: "text-[12rem]" },
  { id: 8, icon: "⚽", left: "78%", top: "75%", speed: 0.1, size: "text-7xl" },
  { id: 9, icon: "🎰", left: "5%", top: "85%", speed: 0.45, size: "text-9xl" },
  { id: 10, icon: "💸", left: "82%", top: "95%", speed: 0.25, size: "text-8xl" },
];

export default function Home() {
  const [dataYaLigi, setDataYaLigi] = useState<{top: any[], more: any[], sidebar_leagues: any[]}>({top: [], more: [], sidebar_leagues: []});
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("ALL"); 
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [betslip, setBetslip] = useState<any[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // Mobile Toggles
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Live Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<{sender: string, text: string}[]>([]);

  // Parallax Scroll State
  const [scrollY, setScrollY] = useState(0);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [betOfTheDay, setBetOfTheDay] = useState<any>(null);
  const [topCombos, setTopCombos] = useState<any[]>([]);

  const [targetOdds, setTargetOdds] = useState<string>("5");
  const [isGenerating, setIsGenerating] = useState(false);

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
    }
  ];

  const t = translations[lang]; 

  useEffect(() => {
    setChatMsgs([{ sender: 'bot', text: t.chatHello }]);
  }, [lang, t.chatHello]);

  useEffect(() => {
    // Parallax Scroll Listener
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
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
          if (!rawData || (!rawData.top && !rawData.more)) { setIsLoading(false); return; }

          setDataYaLigi({ top: rawData.top || [], more: rawData.more || [], sidebar_leagues: rawData.sidebar_leagues || [] });

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
              
              if (allMatches.length >= 13) {
                  const combosArr = [];
                  const safeChunk = allMatches.slice(0, 2);
                  let safeOdds = 1;
                  safeChunk.forEach((m: any) => safeOdds *= ((100 / parseInt(m.asilimia)) * 0.95));
                  combosArr.push({ title: "Safe Double 🛡️", matches: safeChunk, totalOdds: Math.max(1.80, safeOdds).toFixed(2), prob: parseInt(safeChunk[1].asilimia) - 2 });

                  const risky1Chunk = allMatches.slice(2, 5);
                  let r1Odds = 1;
                  risky1Chunk.forEach((m: any) => r1Odds *= ((100 / parseInt(m.asilimia)) * 0.95));
                  combosArr.push({ title: "Treble Boost 🚀", matches: risky1Chunk, totalOdds: Math.max(6.50, r1Odds * 1.5).toFixed(2), prob: 68 });

                  const risky2Chunk = allMatches.slice(5, 9);
                  let r2Odds = 1;
                  risky2Chunk.forEach((m: any) => r2Odds *= ((100 / parseInt(m.asilimia)) * 0.95));
                  combosArr.push({ title: "Expert Acca 🎯", matches: risky2Chunk, totalOdds: Math.max(15.40, r2Odds * 2.5).toFixed(2), prob: 45 });

                  const megaChunk = allMatches.slice(9, 13);
                  let megaOdds = 1;
                  megaChunk.forEach((m: any) => megaOdds *= ((100 / parseInt(m.asilimia)) * 0.95));
                  combosArr.push({ title: "Mega VIP Slip 🤑", matches: megaChunk, totalOdds: Math.max(34.50, megaOdds * 4.2).toFixed(2), prob: 25 });

                  setTopCombos(combosArr);
              }
          }
        }
      } catch (error) { console.error("Fetch error:", error); } 
      finally { setIsLoading(false); }
    };
    fetchData();

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      clearInterval(slideInterval);
      window.removeEventListener("scroll", handleScroll);
    };
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
    showToast(lang === 'en' ? "Logged out successfully" : "Umetoka kikamilifu");
  };

  const handleLandingPageGenerate = () => {
      if(!targetOdds || isNaN(parseFloat(targetOdds))) return showToast("Enter a valid number for Odds");
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          window.location.href = "/login";
      }, 1500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    setChatMsgs([...chatMsgs, userMsg]);
    setChatInput("");

    setTimeout(() => {
        setChatMsgs(prev => [...prev, { sender: 'bot', text: lang === 'en' ? "Thanks for reaching out! A support agent will connect with you shortly. For immediate help, click our WhatsApp link." : "Asante kwa ujumbe wako. Wakala wetu atawasiliana nawe hivi punde. Kwa msaada wa haraka zaidi, tumia link yetu ya WhatsApp." }]);
    }, 1000);
  };

  const toggleBetslip = (match: any, userPick: string, userOdd: string) => {
    const exists = betslip.find((m: any) => m.id === match.id);
    let newSlip = betslip.filter((m: any) => m.id !== match.id);
    
    if (exists && exists.userPick === userPick) {
      setBetslip(newSlip);
      showToast(lang === 'en' ? "❌ Removed from Slip" : "❌ Imetolewa kwenye Mkeka");
    } else {
      newSlip.push({ ...match, userPick, userOdd });
      setBetslip(newSlip);
      showToast(lang === 'en' ? `✅ Added: ${userPick} @ ${userOdd}` : `✅ Imeongezwa: ${userPick} @ ${userOdd}`);
      if (!isSlipOpen) setIsSlipOpen(true);
    }
  };

  const calculateOdds = () => {
    if (betslip.length === 0) return "0.00";
    let tOdds = 1;
    betslip.forEach(m => { tOdds *= parseFloat(m.userOdd); });
    return tOdds.toFixed(2);
  };

  const calculateSlipProbability = () => {
    if (betslip.length === 0) return 0;
    let combinedProb = 1;
    betslip.forEach(m => { combinedProb *= (1 / parseFloat(m.userOdd)); });
    return (combinedProb * 100).toFixed(1);
  };

  const slipProb = parseFloat(calculateSlipProbability() as string);
  
  const activeSidebarLeagues = dataYaLigi.sidebar_leagues?.length > 0 ? dataYaLigi.sidebar_leagues : FALLBACK_LEAGUES;
  const allLeagues = [...dataYaLigi.top, ...dataYaLigi.more];
  
  let displayLeagues = selectedLeague === "ALL" ? allLeagues : allLeagues.filter((l: any) => l.key === selectedLeague);

  if (searchQuery.trim() !== "") {
    const lowerQuery = searchQuery.toLowerCase();
    displayLeagues = displayLeagues.map((league: any) => {
      const isLeagueMatch = league.name?.toLowerCase().includes(lowerQuery) || league.country?.toLowerCase().includes(lowerQuery);
      const filteredMatches = league.matches.filter((m: any) => m.home.toLowerCase().includes(lowerQuery) || m.away.toLowerCase().includes(lowerQuery));
      return { ...league, matches: isLeagueMatch ? league.matches : filteredMatches };
    }).filter((league: any) => league.matches.length > 0);
  }

  const filteredTop = displayLeagues.filter(l => dataYaLigi.top.some(t => t.key === l.key));
  const filteredMore = displayLeagues.filter(l => dataYaLigi.more.some(m => m.key === l.key));
  const isSearching = searchQuery.trim().length > 0 || selectedLeague !== "ALL";

  return (
    <main className="min-h-screen text-gray-200 font-sans selection:bg-[#facc15] selection:text-black pb-20 md:pb-0 relative">
      
      {/* ========================================== */}
      {/* STADIUM BACKGROUND W/ OVERLAY */}
      {/* ========================================== */}
      <div className="fixed inset-0 z-[0] bg-[#070b12]">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-55"
          style={{
             transform: `translateY(${scrollY * 0.15}px)`,
             transition: 'transform 0.1s ease-out'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b12]/30 via-[#070b12]/80 to-[#070b12]"></div>
      </div>

      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#1e61d4] text-white px-6 py-3 rounded-md shadow-[0_10px_40px_rgba(30,97,212,0.6)] z-[100] flex items-center gap-3 font-bold text-sm animate-bounce">
          <span className="text-lg">✅</span> {toastMsg}
        </div>
      )}

      {/* HEADER WITH MOBILE MENU FIX */}
      <header className="bg-[#0d1422]/90 backdrop-blur-md border-b border-[#1c2638] sticky top-0 z-[110] shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4 max-w-[1500px] mx-auto relative">
          
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white text-2xl p-1">
              {isMobileMenuOpen ? '✖' : '☰'}
            </button>

            <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
              <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  <span className="text-[#070b12] font-bold text-xl">S</span>
              </div>
              <span className="hidden sm:block text-xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">SPORTS</span></span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-gray-400 uppercase tracking-wider flex-1 justify-center">
            <Link href="/" className="flex items-center gap-1.5 text-white border-b-2 border-[#facc15] pb-1"><span>⚽</span> {t.sports}</Link>
            <Link href="/aviator" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>✈️</span> {t.aviator}</Link>
            <Link href="/casino" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>🎰</span> {t.casino}</Link>
            <Link href="/contact" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>📞</span> {t.contact}</Link>
          </nav>

          <div className="flex gap-2 sm:gap-4 items-center justify-end flex-shrink-0">
            <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="bg-[#1c2638] text-white px-2 py-1.5 sm:px-3 rounded text-[10px] sm:text-xs font-bold uppercase hover:bg-[#26344d] transition border border-[#26344d]">
                {lang === 'en' ? '🇹🇿 SW' : '🇬🇧 EN'}
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/dashboard" className="hidden sm:block text-[#facc15] font-bold text-sm bg-[#facc15]/10 px-4 py-1.5 rounded border border-[#facc15]/30 hover:bg-[#facc15]/20 transition">
                  {t.goToDashboard}
                </Link>
                <button onClick={handleLogout} className="bg-red-600/10 text-red-500 border border-red-500/30 px-3 sm:px-4 py-1.5 rounded font-bold text-[10px] sm:text-sm hover:bg-red-600 hover:text-white transition whitespace-nowrap">
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/login" className="hidden sm:block text-gray-300 hover:text-white font-bold text-sm transition cursor-pointer">{t.login}</Link>
                <Link href="/register" className="bg-[#1e61d4] text-white px-3 py-1.5 sm:px-5 xl:px-6 sm:py-2 rounded font-bold text-[10px] sm:text-sm hover:bg-[#2563eb] transition shadow-md whitespace-nowrap cursor-pointer">
                  {t.register}
                </Link>
              </div>
            )}
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-[100%] left-0 w-full bg-[#0d1422] border-b border-[#1c2638] shadow-2xl flex flex-col z-[120]">
               <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-[#1c2638] text-white font-black uppercase text-sm flex items-center gap-3"><span>⚽</span> {t.sports}</Link>
               <Link href="/aviator" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-[#1c2638] text-gray-400 font-bold uppercase text-sm flex items-center gap-3 hover:text-white transition"><span>✈️</span> {t.aviator}</Link>
               <Link href="/casino" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-[#1c2638] text-gray-400 font-bold uppercase text-sm flex items-center gap-3 hover:text-white transition"><span>🎰</span> {t.casino}</Link>
               <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-4 text-gray-400 font-bold uppercase text-sm flex items-center gap-3 hover:text-white transition"><span>📞</span> {t.contact}</Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 relative z-10">
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
                {t.createFreeAccount}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-4 gap-6 relative z-10">
        
        {/* MOBILE SIDEBAR TOGGLE BUTTON */}
        <div className="xl:hidden">
           <button 
             onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
             className="w-full bg-[#0d1422] border border-[#1e61d4]/50 text-white p-4 rounded-xl shadow-lg font-black uppercase text-xs flex justify-between items-center transition"
           >
             <span className="flex items-center gap-2"><span className="text-lg">🛠️</span> Filter Leagues & AI Tools</span>
             <span className="text-lg">{isMobileSidebarOpen ? '▲' : '▼'}</span>
           </button>
        </div>

        {/* OVERLAY KWA AJILI YA MOBILE SIDEBAR */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-[140] xl:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        {/* SIDEBAR YA KIPROFESA (OFF-CANVAS KWA SIMU, GRID KWA PC) */}
        <aside className={`fixed top-0 left-0 h-full w-[300px] bg-[#0d1422] border-r border-[#1c2638] p-5 z-[150] overflow-y-auto transition-transform duration-300 xl:relative xl:translate-x-0 xl:w-auto xl:h-auto xl:border-none xl:p-0 xl:z-0 xl:bg-transparent ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} col-span-1 space-y-5`}>
          
          {/* Kitufe cha Kufunga kwenye simu */}
          <div className="flex justify-between items-center xl:hidden mb-6 border-b border-[#1c2638] pb-3">
             <h2 className="text-white font-black text-sm uppercase tracking-widest">Sly Tools</h2>
             <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400 hover:text-white text-2xl">✖</button>
          </div>

          <div className="bg-[#0d1422] border border-[#facc15]/30 rounded-xl overflow-hidden shadow-xl relative sticky top-24">
             <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#facc15]/10 rounded-full blur-2xl"></div>
             <div className="bg-gradient-to-r from-[#facc15] to-yellow-600 p-3 flex justify-between items-center relative z-10">
                <h3 className="text-[#070b12] font-black text-xs uppercase">{t.betOfTheDay}</h3>
             </div>
             <div className="p-4 text-center relative z-10">
                {betOfTheDay ? (
                    <>
                        <p className="text-gray-400 text-[10px] uppercase font-bold mb-2 flex items-center justify-center gap-1">
                          <span>{getSportIcon(betOfTheDay.leagueName)}</span> {betOfTheDay.leagueName}
                        </p>
                        <h4 className="text-white font-black text-sm mb-3">{betOfTheDay.home} vs {betOfTheDay.away}</h4>
                        <div className="bg-[#162032] border border-[#26344d] p-2 rounded flex justify-between items-center">
                           <span className="text-xs font-bold text-gray-400">PICK: <span className="text-[#facc15]">{betOfTheDay.ai_tip}</span></span>
                        </div>
                    </>
                ) : <p className="text-gray-500 text-xs py-4">{t.scanningPicks}</p>}
             </div>
          </div>

          <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl p-4 shadow-xl">
             <h3 className="text-purple-400 font-black uppercase tracking-widest text-xs mb-3 border-b border-[#1c2638] pb-2 text-center">🤖 AI Slip Auto-Generator</h3>
             <p className="text-[9px] text-gray-400 text-center mb-4">Set your target odds. AI will automatically build a high-probability slip.</p>
             <div className="flex flex-col gap-3">
                 <div className="flex bg-[#162032] border border-[#26344d] rounded-lg overflow-hidden">
                     <span className="bg-[#1c2638] text-gray-400 font-black px-3 py-2 border-r border-[#26344d]">Odds@</span>
                     <input 
                         type="number" min="1.5" step="0.5"
                         value={targetOdds} 
                         onChange={(e) => setTargetOdds(e.target.value)}
                         className="w-full bg-transparent text-white font-black text-sm px-3 focus:outline-none"
                     />
                 </div>
                 <button 
                     onClick={handleLandingPageGenerate} 
                     disabled={isGenerating}
                     className="w-full bg-gradient-to-r from-purple-600 to-[#1e61d4] text-white font-black py-2 rounded-lg text-[10px] uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition transform disabled:opacity-50"
                 >
                     {isGenerating ? "Analyzing..." : "Generate Slip"}
                 </button>
             </div>
          </div>

          <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl p-4 flex flex-col max-h-[40vh]">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-3 border-b border-[#1c2638] pb-2">{t.leaguesToday}</h3>
            <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                <button onClick={() => {setSelectedLeague("ALL"); setIsMobileSidebarOpen(false);}} className={`p-2 rounded text-left text-xs transition-all ${selectedLeague === "ALL" ? "bg-[#1e61d4] text-white font-black" : "bg-[#162032] text-gray-400 hover:bg-[#1c2638]"}`}>🔥 {t.allMatches}</button>
                {activeSidebarLeagues.map((league: any) => (
                    <button key={league.key} onClick={() => {setSelectedLeague(league.key); setIsMobileSidebarOpen(false);}} className={`p-2 rounded text-left text-xs transition-all flex items-center gap-2 ${selectedLeague === league.key ? "bg-[#1e61d4] text-white font-black" : "bg-[#162032] text-gray-400 hover:bg-[#1c2638]"}`}>
                      <span className="text-sm">{getSportIcon(league.name, league.icon)}</span> <span className="truncate">{league.name}</span>
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-4 mt-5">
             <a href="https://whatsapp.com/channel/0029VbCbNM23gvWVS8NV8g3F" target="_blank" rel="noopener noreferrer" className="bg-[#0d1422] border border-[#25D366]/50 hover:bg-[#25D366]/10 text-white p-4 rounded-xl flex items-center justify-between shadow-xl hover:scale-105 transition-all group block">
                <div className="flex items-center gap-3">
                   <span className="text-3xl text-[#25D366]">💬</span>
                   <div>
                      <h4 className="font-black text-[11px] uppercase leading-tight group-hover:text-[#25D366] transition-colors">{t.joinWhatsApp}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{t.freeCodes}</p>
                   </div>
                </div>
                <span className="text-xl font-bold text-[#25D366] group-hover:translate-x-1 transition-transform">➔</span>
             </a>

             <a href="https://www.instagram.com/sly_sports_tips?igsh=ajNycHpobnNqNGl2" target="_blank" rel="noopener noreferrer" className="bg-[#0d1422] border border-[#E1306C]/50 hover:bg-[#E1306C]/10 text-white p-4 rounded-xl flex items-center justify-between shadow-xl hover:scale-105 transition-all group block">
                <div className="flex items-center gap-3">
                   <span className="text-3xl text-[#E1306C]">📸</span>
                   <div>
                      <h4 className="font-black text-[11px] uppercase leading-tight group-hover:text-[#E1306C] transition-colors">{t.joinInstagram}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{t.dailyTips}</p>
                   </div>
                </div>
                <span className="text-xl font-bold text-[#E1306C] group-hover:translate-x-1 transition-transform">➔</span>
             </a>

             {/* LUCKYPARI Card */}
             <div className="bg-[#0d1422] border border-[#facc15]/30 rounded-xl overflow-hidden shadow-xl relative group hover:border-[#facc15] transition-all">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#facc15]/10 rounded-full blur-2xl"></div>
                <div className="bg-gradient-to-r from-[#facc15] to-yellow-600 p-3 flex justify-between items-center relative z-10">
                   <h3 className="text-[#070b12] font-black text-[10px] uppercase">🎁 LuckyPari Promo</h3>
                </div>
                <div className="p-4 text-center relative z-10">
                   <p className="text-white font-black text-sm mb-3">130% DEPOSIT BONUS</p>
                   <div className="bg-[#162032] border border-[#26344d] p-2 rounded flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-gray-400">CODE:</span>
                      <span className="text-xs font-black text-[#facc15]">SLYSPORTS</span>
                   </div>
                   <a href="https://lckypr.com/Slysports" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#facc15] text-[#070b12] font-black py-2 rounded text-[10px] uppercase tracking-wider hover:bg-yellow-400 transition">
                      Claim Bonus Now
                   </a>
                </div>
             </div>

             {/* Meridianbet Card */}
             <div className="bg-[#0d1422] border border-red-500/30 rounded-xl overflow-hidden shadow-xl relative group hover:border-red-500 transition-all">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-3 flex justify-between items-center relative z-10">
                   <h3 className="text-white font-black text-[10px] uppercase">🔴 Meridianbet Promo</h3>
                </div>
                <div className="p-4 text-center relative z-10">
                   <p className="text-white font-black text-sm mb-3">EXCLUSIVE SIGNUP BONUS</p>
                   <div className="bg-[#162032] border border-[#26344d] p-2 rounded flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-gray-400">CODE:</span>
                      <span className="text-xs font-black text-red-500">SYLSPORTS</span>
                   </div>
                   <a href={lang === 'en' ? 'https://meridianbet.co.tz/en/sign-up' : 'https://meridianbet.co.tz/sw/jisajili'} target="_blank" rel="noopener noreferrer" className="block w-full bg-red-600 text-white font-black py-2 rounded text-[10px] uppercase tracking-wider hover:bg-red-500 transition">
                      Claim Bonus Now
                   </a>
                </div>
             </div>

             {/* 888Starz Card */}
             <div className="bg-[#0d1422] border border-green-500/30 rounded-xl overflow-hidden shadow-xl relative group hover:border-green-500 transition-all">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="bg-gradient-to-r from-green-500 to-green-700 p-3 flex justify-between items-center relative z-10">
                   <h3 className="text-white font-black text-[10px] uppercase">🟢 888Starz Promo</h3>
                </div>
                <div className="p-4 text-center relative z-10">
                   <p className="text-white font-black text-sm mb-3">PREMIUM BETTING BONUS</p>
                   <div className="bg-[#162032] border border-[#26344d] p-2 rounded flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-gray-400">STATUS:</span>
                      <span className="text-xs font-black text-green-500">ACTIVE</span>
                   </div>
                   <a href="https://top100bonus.com/L?tag=d_5541916m_64133c_&site=5541916&ad=64133" target="_blank" rel="noopener noreferrer" className="block w-full bg-green-500 text-white font-black py-2 rounded text-[10px] uppercase tracking-wider hover:bg-green-400 transition">
                      Get Bonus Now
                   </a>
                </div>
             </div>
          </div>
        </aside>

        {/* MATCH LIST (KULIA) */}
        <div className="col-span-1 xl:col-span-3">
          
          {!isLoading && topCombos.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 border-l-4 border-purple-500 pl-3">
                 <h2 className="text-xl font-black text-white uppercase tracking-wide">{t.topTenPicks}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCombos.map((combo, idx) => (
                   <div key={idx} className="bg-[#0d1422] border border-[#1c2638] hover:border-purple-500/50 transition duration-300 rounded-xl p-5 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full blur-2xl"></div>
                      
                      <div className="flex justify-between items-center mb-4 border-b border-[#1c2638] pb-3">
                         <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">{combo.title}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-2xl font-black text-[#facc15]">{combo.totalOdds} Odds</span>
                               <span className={`text-[10px] px-2 py-0.5 rounded font-black ${combo.prob > 60 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{combo.prob}% SURE</span>
                            </div>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-[#162032] flex items-center justify-center border border-[#26344d]">
                            {idx === 0 ? '🛡️' : idx === 1 ? '🚀' : idx === 2 ? '🎯' : '🤑'}
                         </div>
                      </div>
                      
                      <div className="space-y-2 mb-4 relative">
                         {!isLoggedIn && <div className="absolute inset-0 bg-[#0d1422]/60 backdrop-blur-[3px] z-10 flex items-center justify-center rounded-lg">
                             <Link href="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] transition uppercase text-xs tracking-widest flex items-center gap-2 text-center">
                                🔒 {t.loginToView}
                             </Link>
                         </div>}

                         {combo.matches.map((m: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                               <span className="text-gray-300 font-bold truncate max-w-[180px]">{m.home} vs {m.away}</span>
                               <span className="text-[#5c98ff] font-black uppercase bg-[#1e61d4]/10 px-2 py-0.5 rounded">🤖 {isLoggedIn ? m.ai_tip : '***'}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
             <h2 className="text-xl font-bold text-white uppercase tracking-wide border-l-4 border-[#1e61d4] pl-3">{t.liveHighlights}</h2>
             <div className="relative w-full md:w-64">
               <input 
                 type="text" 
                 placeholder={t.searchPlaceholder} 
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
                <p className="text-gray-500 font-bold text-sm animate-pulse">{t.loadingOdds}</p>
              </div>
            ) : (filteredTop.length > 0 || filteredMore.length > 0) ? (
              <div className="flex flex-col">
                {filteredTop.map((ligi: any, index: number) => (
                  <LeagueSection key={`top-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} isLoggedIn={isLoggedIn} langText={t} />
                ))}
                {filteredMore.length > 0 && (
                   <details className="group/leagues" open={isSearching}>
                     <summary className="list-none cursor-pointer bg-[#090d16] hover:bg-[#111a2a] text-center py-4 border-t border-[#1c2638] transition font-black text-xs uppercase tracking-widest text-[#5c98ff] outline-none">
                       {isSearching ? <span>{t.searchResults} ({filteredMore.length})</span> : <><span className="group-open/leagues:hidden">{t.viewAllOther} ({filteredMore.length})</span><span className="hidden group-open/leagues:block">{t.hideOther}</span></>}
                     </summary>
                     <div className="flex flex-col bg-[#070b12]">
                       {filteredMore.map((ligi: any, index: number) => (
                         <LeagueSection key={`more-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} isLoggedIn={isLoggedIn} langText={t} />
                       ))}
                     </div>
                   </details>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <span className="text-4xl block mb-3 opacity-50">🔍</span>
                <p className="font-bold text-gray-300">{t.noMatches}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING SLIP BUILDER */}
      {betslip.length > 0 && (
        <div className={`fixed bottom-0 md:bottom-10 right-0 md:right-[5rem] w-full md:w-80 bg-[#0d1422] md:border border-[#1e61d4] rounded-t-xl md:rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-[0_10px_50px_rgba(30,97,212,0.3)] z-[95] transition-transform duration-300 ${isSlipOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}`}>
          <div onClick={() => setIsSlipOpen(!isSlipOpen)} className="bg-[#1e61d4] text-white p-4 md:rounded-t-xl cursor-pointer flex justify-between items-center font-black uppercase text-sm">
            <span>🎟️ {t.betslip} ({betslip.length})</span>
            <span>{isSlipOpen ? '▼' : '▲'}</span>
          </div>
          
          <div className="p-4 bg-[#162032] max-h-[40vh] md:max-h-64 overflow-y-auto custom-scrollbar">
            {betslip.map((m, i) => (
              <div key={i} className="flex justify-between items-center border-b border-[#26344d] pb-2 mb-2 last:border-0">
                <div className="w-full">
                  <p className="text-[10px] text-gray-400 font-bold leading-tight truncate">{m.home} vs {m.away}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-white bg-[#070b12] px-2 py-0.5 rounded">{m.userPick}</span>
                    <span className="text-xs font-black text-[#facc15]">@{m.userOdd}</span>
                  </div>
                </div>
                <button onClick={() => toggleBetslip(m, m.userPick, m.userOdd)} className="text-gray-500 text-xs font-black p-2 hover:text-red-500 bg-[#070b12] rounded ml-2">X</button>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[#1c2638] bg-[#0d1422] md:rounded-b-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 font-bold uppercase text-xs">{t.totalOdds}</span>
              <span className="text-xl font-black text-[#facc15]">{calculateOdds()}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-bold uppercase text-xs">Win Probability</span>
              <span className={`text-sm font-black ${slipProb >= 70 ? 'text-green-500' : slipProb >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>{slipProb}%</span>
            </div>
            
            {/* VIFUNGO VYA WASHIRIKA KWA BETSLIP */}
            {isLoggedIn ? (
              <div className="mt-3 border-t border-[#1c2638] pt-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase text-center mb-3">{t.signInBet}</p>
                <div className="flex flex-col gap-2">
                    <a href="https://lckypr.com/Slysports" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-[#1c2638] hover:bg-[#26344d] border border-[#26344d] hover:border-[#facc15] p-3 rounded-lg transition group">
                        <span className="text-white font-black text-xs uppercase">LuckyPari</span>
                        <span className="bg-[#facc15]/10 text-[#facc15] px-2 py-1 rounded text-[9px] font-black">CODE: SLYSPORTS</span>
                    </a>
                    <a href={lang === 'en' ? 'https://meridianbet.co.tz/en/sign-up' : 'https://meridianbet.co.tz/sw/jisajili'} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-[#1c2638] hover:bg-[#26344d] border border-[#26344d] hover:border-red-500 p-3 rounded-lg transition group">
                        <span className="text-white font-black text-xs uppercase">Meridianbet</span>
                        <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-[9px] font-black">CODE: SYLSPORTS</span>
                    </a>
                    <a href="https://top100bonus.com/L?tag=d_5541916m_64133c_&site=5541916&ad=64133" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-[#1c2638] hover:bg-[#26344d] border border-[#26344d] hover:border-green-500 p-3 rounded-lg transition group">
                        <span className="text-white font-black text-xs uppercase">888Starz</span>
                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[9px] font-black">GET BONUS 🎁</span>
                    </a>
                </div>
              </div>
            ) : (
              <Link href="/login" className="block text-center w-full bg-[#1e61d4] text-white py-3 rounded font-black uppercase text-sm transition hover:bg-[#2563eb] shadow-lg shadow-blue-500/20 mt-2">
                {t.loginSave}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* LIVE CHAT WIDGET 💬 */}
      <div className="fixed bottom-20 md:bottom-10 right-4 md:right-10 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl shadow-2xl w-[280px] sm:w-[320px] mb-4 flex flex-col h-[350px] overflow-hidden animate-fade-in">
             <div className="bg-gradient-to-r from-[#1e61d4] to-[#2563eb] p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
                   <div>
                      <h3 className="font-black text-xs uppercase tracking-wide">Sly AI Support</h3>
                      <p className="text-[9px] text-blue-200 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online</p>
                   </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white transition text-lg">✖</button>
             </div>
             <div className="flex-1 p-4 overflow-y-auto bg-[#070b12] space-y-3 custom-scrollbar">
                {chatMsgs.map((msg, i) => (
                   <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-xl text-xs font-medium leading-relaxed ${msg.sender === 'user' ? 'bg-[#1e61d4] text-white rounded-br-none shadow-md' : 'bg-[#1c2638] text-gray-200 rounded-bl-none border border-[#26344d] shadow-md'}`}>
                         {msg.text}
                      </div>
                   </div>
                ))}
             </div>
             <form onSubmit={handleSendChat} className="p-3 bg-[#0d1422] border-t border-[#1c2638] flex gap-2">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder={lang === 'en' ? "Type a message..." : "Andika ujumbe..."} 
                  className="flex-1 bg-[#162032] border border-[#26344d] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#1e61d4] transition"
                />
                <button type="submit" className="bg-[#facc15] text-[#070b12] px-4 py-2 rounded-lg font-black text-xs hover:bg-yellow-400 transition shadow-md">➤</button>
             </form>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="w-14 h-14 bg-gradient-to-r from-[#1e61d4] to-[#2563eb] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(30,97,212,0.6)] hover:scale-110 transition-transform relative border-2 border-white/10"
        >
           {isChatOpen ? (
             <span className="text-white text-xl font-bold">✖</span>
           ) : (
             <>
               <span className="text-white text-2xl">💬</span>
               <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-[#070b12] rounded-full"></span>
             </>
           )}
        </button>
      </div>

      {/* ========================================== */}
      {/* PROFESSIONAL FOOTER YENYE MPANGILIO MPYA */}
      {/* ========================================== */}
      <footer className="bg-[#090d16] border-t border-[#1c2638] pt-12 pb-24 md:pb-12 mt-10 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            
            {/* 1. Kushoto (Quick Links na Mitandao ya Kijamii) */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
               <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-4 border-b border-[#1c2638] pb-2 inline-block md:block w-full md:w-auto">{t.quickLinks}</h4>
               <nav className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-6">
                 <Link href="/" className="text-gray-400 hover:text-white text-xs font-bold transition">{t.sports}</Link>
                 <Link href="/aviator" className="text-gray-400 hover:text-white text-xs font-bold transition">{t.aviator}</Link>
                 <Link href="/casino" className="text-gray-400 hover:text-white text-xs font-bold transition">{t.casino}</Link>
                 <Link href="/contact" className="text-gray-400 hover:text-white text-xs font-bold transition">{t.contact}</Link>
               </nav>

               <div className="flex gap-4 justify-center md:justify-start">
                  <a href="https://whatsapp.com/channel/0029VbCbNM23gvWVS8NV8g3F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center text-xl hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all border border-[#25D366]/30">
                     💬
                  </a>
                  <a href="https://www.instagram.com/sly_sports_tips?igsh=ajNycHpobnNqNGl2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#E1306C]/10 text-[#E1306C] rounded-full flex items-center justify-center text-xl hover:bg-[#E1306C] hover:text-white hover:scale-110 transition-all border border-[#E1306C]/30">
                     📸
                  </a>
               </div>
            </div>

            {/* 2. Katikati (Logo na Onyo 18+) */}
            <div className="text-center flex flex-col items-center">
               <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-10 h-10 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                      <span className="text-[#070b12] font-bold text-2xl">S</span>
                  </div>
                  <span className="text-2xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">SPORTS</span></span>
               </Link>
               
               <div className="inline-block border-2 border-red-500 rounded-full w-12 h-12 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <span className="text-red-500 font-black text-lg">18+</span>
               </div>
               
               <p className="text-gray-500 text-[10px] leading-relaxed max-w-sm uppercase font-bold tracking-wider">
                  {t.disclaimerWarn} <br/> {t.disclaimerAge}
               </p>
            </div>

            {/* 3. Kulia (Useful Links / Mamlaka za TZ) */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
               <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-4 border-b border-[#1c2638] pb-2 inline-block md:block w-full md:w-auto">{t.usefulLinks}</h4>
               <div className="flex flex-col items-center md:items-end gap-3">
                  <a href="https://www.fiu.go.tz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1e61d4] transition text-xs font-bold flex items-center justify-center md:justify-end gap-2 group">
                     <span className="text-lg group-hover:scale-110 transition-transform">⚖️</span> Financial Intelligence Unit (FIU)
                  </a>
                  <a href="https://www.gamingboard.go.tz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#facc15] transition text-xs font-bold flex items-center justify-center md:justify-end gap-2 group">
                     <span className="text-lg group-hover:scale-110 transition-transform">🎰</span> Gaming Board of Tanzania
                  </a>
                  <a href="https://www.tcra.go.tz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition text-xs font-bold flex items-center justify-center md:justify-end gap-2 group">
                     <span className="text-lg group-hover:scale-110 transition-transform">📡</span> TCRA Tanzania
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition text-xs font-bold flex items-center justify-center md:justify-end gap-2 group">
                     <span className="text-lg group-hover:scale-110 transition-transform">🛑</span> {lang === 'en' ? 'Responsible Gaming' : 'Cheza Kistaarabu'}
                  </a>
               </div>
            </div>

          </div>
          
          {/* Haki Miliki */}
          <div className="border-t border-[#1c2638] mt-10 pt-6 text-center">
             <p className="text-gray-600 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
               © {new Date().getFullYear()} SLYSPORTS TIPS. {lang === 'en' ? 'ALL RIGHTS RESERVED.' : 'HAKI ZOTE ZIMEHIFADHIWA.'}
             </p>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="xl:hidden fixed bottom-0 left-0 w-full bg-[#0d1422] border-t border-[#1c2638] flex justify-around items-center py-3 px-2 z-[90] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
         <Link href="/" className="flex flex-col items-center text-[#facc15] gap-1"><span className="text-xl">🏠</span><span className="text-[9px] font-black uppercase">Home</span></Link>
         <Link href="/dashboard" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1"><span className="text-xl">📊</span><span className="text-[9px] font-bold uppercase">Dashboard</span></Link>
         {isLoggedIn ? (
           <div onClick={handleLogout} className="flex flex-col items-center text-red-500 hover:text-red-400 transition gap-1 cursor-pointer"><span className="text-xl">🚪</span><span className="text-[9px] font-bold uppercase">Logout</span></div>
         ) : (
           <Link href="/login" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1"><span className="text-xl">👤</span><span className="text-[9px] font-bold uppercase">Login</span></Link>
         )}
      </nav>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0d1422; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1c2638; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1e61d4; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
}

// =================================================================
// COMPONENT YA JEDWALI 
// =================================================================
function LeagueSection({ ligi, betslip, toggleBetslip, isLoggedIn, langText }: { ligi: any, betslip: any[], toggleBetslip: any, isLoggedIn: boolean, langText: any }) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 10;
  const hasMore = ligi.matches?.length > INITIAL_COUNT;
  const visibleMatches = expanded ? ligi.matches : ligi.matches?.slice(0, INITIAL_COUNT);

  return (
    <div className="border-b border-[#1c2638] last:border-0 bg-[#0d1422]">
      <div className="flex items-center gap-3 bg-[#111a2a] px-4 py-3 border-b border-[#1c2638]">
        <span className="text-[16px]">{getSportIcon(ligi.name, ligi.icon)}</span>
        <h2 className="font-black text-xs uppercase tracking-widest text-[#5c98ff]">{ligi.name}</h2>
      </div>

      <div className="flex flex-col">
        {visibleMatches?.map((mkeka: any) => (
           <MatchRow key={mkeka.id} mkeka={mkeka} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} isLoggedIn={isLoggedIn} langText={langText} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div 
          onClick={() => setExpanded(true)} 
          className="text-center py-4 bg-[#162032] text-[#5c98ff] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-[#1e61d4] hover:text-white transition border-t border-[#1c2638]"
        >
          ▼ Show {ligi.matches.length - INITIAL_COUNT} More Matches in {ligi.name}
        </div>
      )}
    </div>
  );
}

function MatchRow({ mkeka, ligi, betslip, toggleBetslip, isLoggedIn, langText }: { mkeka: any, ligi: any, betslip: any[], toggleBetslip: any, isLoggedIn: boolean, langText: any }) {
  const seed = parseInt(String(mkeka.id).replace(/\D/g, '')) || 123;
  const deterministicRandom = (offset: number) => { const x = Math.sin(seed + offset) * 10000; return x - Math.floor(x); };

  const aiConf = parseInt(mkeka.asilimia) || 50;
  const aiImpliedOdd = ((100 / aiConf) * 0.95).toFixed(2);
  const rawTip = mkeka.ai_tip.toUpperCase();
  let aiTarget = rawTip;

  let goalMarket = "2.5";
  if (rawTip.includes("1.5")) goalMarket = "1.5";
  if (rawTip.includes("3.5")) goalMarket = "3.5";

  const isSoccer = !ligi.name.toLowerCase().includes("basket") && !ligi.name.toLowerCase().includes("tennis");

  const standardOptions = isSoccer ? [
      { group: "1X2", options: [{ label: "1", odd: aiTarget === "1" ? aiImpliedOdd : (deterministicRandom(1) * 2 + 1.5).toFixed(2) }, { label: "X", odd: aiTarget === "X" ? aiImpliedOdd : (deterministicRandom(2) * 1.5 + 2.8).toFixed(2) }, { label: "2", odd: aiTarget === "2" ? aiImpliedOdd : (deterministicRandom(3) * 2 + 2.5).toFixed(2) }]},
      { group: "DC", options: [{ label: "1X", odd: aiTarget === "1X" ? aiImpliedOdd : (deterministicRandom(4) * 0.5 + 1.1).toFixed(2) }, { label: "12", odd: aiTarget === "12" ? aiImpliedOdd : (deterministicRandom(5) * 0.3 + 1.2).toFixed(2) }, { label: "X2", odd: aiTarget === "X2" ? aiImpliedOdd : (deterministicRandom(6) * 0.8 + 1.3).toFixed(2) }]},
      { group: `O/U ${goalMarket}`, options: [{ label: `O ${goalMarket}`, odd: aiTarget.includes(`O ${goalMarket}`) || aiTarget.includes("OVER") ? aiImpliedOdd : (deterministicRandom(7) * 1 + 1.6).toFixed(2) }, { label: `U ${goalMarket}`, odd: aiTarget.includes(`U ${goalMarket}`) || aiTarget.includes("UNDER") ? aiImpliedOdd : (deterministicRandom(8) * 1 + 1.6).toFixed(2) }]},
      { group: "BTTS", options: [{ label: "GG", odd: aiTarget === "GG" ? aiImpliedOdd : (deterministicRandom(9) * 1 + 1.7).toFixed(2) }, { label: "NG", odd: aiTarget === "NG" ? aiImpliedOdd : (deterministicRandom(10) * 1 + 1.7).toFixed(2) }]}
  ] : [
      { group: "WINNER", options: [{ label: "1", odd: aiTarget === "1" ? aiImpliedOdd : (deterministicRandom(1) * 1.5 + 1.3).toFixed(2) }, { label: "2", odd: aiTarget === "2" ? aiImpliedOdd : (deterministicRandom(2) * 1.5 + 1.5).toFixed(2) }]}
  ];

  return (
    <div className="px-4 py-4 border-b border-[#1c2638]/50 hover:bg-[#162032] transition duration-200">
      <div className="flex justify-between items-center mb-3">
         <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#facc15] font-bold bg-yellow-500/10 px-2 py-0.5 rounded text-center">{mkeka.status}</span>
            <div className="font-bold text-sm text-gray-200">{mkeka.home} <span className="text-gray-500 font-normal px-1">vs</span> {mkeka.away}</div>
         </div>
         <div className={`inline-flex items-center gap-2 border rounded px-2 py-1 ${isLoggedIn ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1c2638]/50 border-[#26344d] cursor-pointer'}`}>
            {isLoggedIn ? (
                <>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest hidden md:inline">🤖 AI: {mkeka.ai_tip}</span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest md:hidden">🤖 {mkeka.ai_tip}</span>
                  <span className="text-[9px] text-green-400 font-bold bg-green-500/20 px-1 rounded">{mkeka.asilimia}</span>
                </>
            ) : (
                <Link href="/login" className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition">
                  🔒 {langText.vipOnly}
                </Link>
            )}
         </div>
      </div>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
         {standardOptions.map(group => (
            <div key={group.group} className="flex flex-col bg-[#090d16] p-1.5 rounded border border-[#1c2638] min-w-[120px] md:min-w-0 md:flex-1">
               <span className="text-[8px] text-gray-500 font-bold uppercase text-center mb-1">{group.group}</span>
               <div className="flex gap-1">
                  {group.options.map(opt => {
                     const inSlip = betslip.find((m: any) => m.id === mkeka.id && m.userPick === opt.label);
                     const isAiRecommend = isLoggedIn && aiTarget.includes(opt.label); 
                     
                     return (
                        <button 
                          key={opt.label}
                          onClick={() => toggleBetslip({...mkeka, leagueName: ligi.name}, opt.label, opt.odd)}
                          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded transition relative overflow-hidden ${
                            inSlip ? "bg-[#1e61d4] border border-[#5c98ff] shadow-lg shadow-blue-500/20" : isAiRecommend ? "bg-green-500/10 border border-green-500/50 hover:bg-green-500/20" : "bg-[#070b12] border border-[#26344d] hover:bg-[#1c2638]"
                          }`}
                        >
                          {isAiRecommend && !inSlip && <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none"></div>}
                          <span className={`text-[9px] font-black ${inSlip ? "text-white" : isAiRecommend ? "text-green-500" : "text-gray-400"}`}>{opt.label}</span>
                          <span className={`text-[10px] font-bold ${inSlip ? "text-white" : "text-gray-300"}`}>{opt.odd}</span>
                        </button>
                     )
                  })}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}