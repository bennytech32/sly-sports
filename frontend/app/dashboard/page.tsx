"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ==========================================
// DYNAMIC ICONS HELPER 
// ==========================================
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

export default function Dashboard() {
  const [dataYaLigi, setDataYaLigi] = useState<{top: any[], more: any[]}>({top: [], more: []});
  const [adminSlips, setAdminSlips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [user, setUser] = useState<any>(null);
  
  // Tabs: dashboard, admin, scanner, builder
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [betslip, setBetslip] = useState<any[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false); 
  
  // Dynamic Stats & Combos
  const [betOfTheDay, setBetOfTheDay] = useState<any>(null);
  const [topCombos, setTopCombos] = useState<any[]>([]); 
  const [allAvailableMatches, setAllAvailableMatches] = useState<any[]>([]);

  // AI Scanner & Generator States
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [targetOdds, setTargetOdds] = useState<string>("5");
  const [isGenerating, setIsGenerating] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 1. Verify User
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/login"; 
    }

    // 2. Fetch Data
    const fetchData = async () => {
      try {
        const cacheBuster = new Date().getTime();
        const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";
        
        const resMatches = await fetch(`${baseUrl}/api/mikeka?t=${cacheBuster}`, { cache: "no-store" });
        if (resMatches.ok) {
          const rawData = await resMatches.json();
          if (rawData && (rawData.top?.length > 0 || rawData.more?.length > 0)) {
             setDataYaLigi({ top: rawData.top || [], more: rawData.more || [] });
             
             let allMatches: any[] = [];
             [...(rawData.top || []), ...(rawData.more || [])].forEach((ligi: any) => {
               if(ligi.matches) {
                 allMatches = [...allMatches, ...ligi.matches.map((m: any) => ({...m, leagueName: ligi.name}))];
               }
             });
             allMatches.sort((a, b) => parseInt(b.asilimia) - parseInt(a.asilimia));
             setAllAvailableMatches(allMatches);

             if (allMatches.length > 0) {
                 setBetOfTheDay(allMatches[0]);

                 // GENERATE COMBOS 
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
        }

        const resSlips = await fetch(`${baseUrl}/api/admin/slips`, { cache: "no-store" });
        if (resSlips.ok) {
           const slipsData = await resSlips.json();
           setAdminSlips(slipsData);
        }

      } catch (error) { console.error("Fetch error:", error); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("slyUser");
    window.location.href = "/login";
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!scanCode.trim()) return;
    setIsScanning(true);
    setScanResult(null);

    try {
        const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";
        const res = await fetch(`${baseUrl}/api/scan-slip`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: scanCode })
        });
        if(res.ok) {
            const data = await res.json();
            setTimeout(() => { 
                setScanResult(data);
                setIsScanning(false);
            }, 1500);
        }
    } catch(err) {
        setIsScanning(false);
        showToast("Error connecting to AI Server.");
    }
  };

  const toggleBetslip = (match: any, userPick: string, userOdd: string) => {
    const exists = betslip.find((m: any) => m.id === match.id);
    let newSlip = betslip.filter((m: any) => m.id !== match.id);
    
    if (exists && exists.userPick === userPick) {
      setBetslip(newSlip);
      showToast("❌ Removed from Slip");
    } else {
      newSlip.push({ ...match, userPick, userOdd });
      setBetslip(newSlip);
      showToast(`✅ Added: ${userPick} @ ${userOdd}`);
      if (!isSlipOpen) setIsSlipOpen(true);
    }
  };

  const addComboToSlip = (comboMatches: any[]) => {
      let currentSlip = [...betslip];
      comboMatches.forEach(m => {
          const aiOdd = ((100 / parseInt(m.asilimia)) * 0.95).toFixed(2);
          if(!currentSlip.find(sm => sm.id === m.id)) {
              currentSlip.push({ ...m, userPick: m.ai_tip, userOdd: aiOdd });
          }
      });
      setBetslip(currentSlip);
      showToast("✅ Combo Added to Slip");
      if (!isSlipOpen) setIsSlipOpen(true);
      setActiveTab("builder");
  };

  const generateAutoSlip = () => {
      if(!targetOdds || isNaN(parseFloat(targetOdds))) return showToast("Enter a valid number for Odds");
      setIsGenerating(true);
      setBetslip([]); 
      
      setTimeout(() => {
          const target = parseFloat(targetOdds);
          let currentOdds = 1;
          const generatedSlip: any[] = [];
          
          for (let i = 0; i < allAvailableMatches.length; i++) {
              const m = allAvailableMatches[i];
              const aiOdd = parseFloat(((100 / parseInt(m.asilimia)) * 0.95).toFixed(2));
              
              if ((currentOdds * aiOdd) <= (target + 1.5)) { 
                  generatedSlip.push({ ...m, userPick: m.ai_tip, userOdd: aiOdd.toFixed(2) });
                  currentOdds *= aiOdd;
              }
              if (currentOdds >= target) break;
          }

          if (generatedSlip.length > 0) {
              setBetslip(generatedSlip);
              showToast(`✅ Generated Slip with ${currentOdds.toFixed(2)} Odds`);
              if (!isSlipOpen) setIsSlipOpen(true);
          } else {
              showToast("❌ Could not generate slip. Try lower odds.");
          }
          setIsGenerating(false);
      }, 1500);
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

  // Search filter
  const allLeagues = [...dataYaLigi.top, ...dataYaLigi.more];
  let displayLeagues = allLeagues;

  if (searchQuery.trim() !== "") {
    const lowerQuery = searchQuery.toLowerCase();
    displayLeagues = displayLeagues.map((league: any) => {
      const isLeagueMatch = league.name?.toLowerCase().includes(lowerQuery);
      const filteredMatches = league.matches.filter((m: any) => m.home.toLowerCase().includes(lowerQuery) || m.away.toLowerCase().includes(lowerQuery));
      return { ...league, matches: isLeagueMatch ? league.matches : filteredMatches };
    }).filter((league: any) => league.matches.length > 0);
  }

  const filteredTop = displayLeagues.filter(l => dataYaLigi.top.some(t => t.key === l.key));
  const filteredMore = displayLeagues.filter(l => dataYaLigi.more.some(m => m.key === l.key));

  if (!user) return <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-200 font-sans flex flex-col md:flex-row selection:bg-[#facc15] selection:text-black relative">
      
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#facc15] text-[#070b12] px-6 py-3 rounded-md shadow-2xl z-[100] font-black animate-bounce flex items-center gap-2">
          {toastMsg}
        </div>
      )}

      {/* --- SIDEBAR YA KIPROFESA --- */}
      <aside className="w-full md:w-64 bg-[#0d1422] border-r border-[#1c2638] flex-shrink-0 sticky top-0 md:h-screen md:overflow-y-auto shadow-xl z-20">
        <div className="p-6 border-b border-[#1c2638] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]"><span className="text-[#070b12] font-bold text-xl">S</span></div>
            <span className="text-xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">VIP</span></span>
          </Link>
        </div>

        <div className="p-4">
          <div className="bg-[#162032] rounded-lg p-4 mb-6 border border-[#26344d] flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#1e61d4] to-[#facc15] rounded-full flex items-center justify-center text-white font-bold shadow-lg">👤</div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Welcome Boss</p>
              <p className="text-sm text-white font-black truncate">{user.name || "VIP Member"}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "dashboard" ? "bg-[#1e61d4]/10 text-[#5c98ff] border-[#1e61d4]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>📊</span> Live AI Picks
            </button>
            <button onClick={() => setActiveTab("admin")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "admin" ? "bg-[#facc15]/10 text-[#facc15] border-[#facc15]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>👑</span> VIP Slips <span className="ml-auto bg-red-500 text-white text-[9px] px-2 py-0.5 rounded animate-pulse">NEW</span>
            </button>
            <button onClick={() => setActiveTab("scanner")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "scanner" ? "bg-purple-500/10 text-purple-400 border-purple-500" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>🤖</span> AI Slip Scanner
            </button>
            <button onClick={() => setActiveTab("builder")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "builder" ? "bg-[#1e61d4]/10 text-[#5c98ff] border-[#1e61d4]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>🎟️</span> My Builder <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-black ${betslip.length > 0 ? "bg-[#facc15] text-[#070b12]" : "bg-gray-700 text-white"}`}>{betslip.length}</span>
            </button>
          </nav>
        </div>

        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-[#162032] text-gray-400 hover:text-white px-4 py-3 rounded-md font-bold text-sm transition border border-[#26344d] hover:border-red-500 hover:bg-red-500/10">
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 md:h-screen md:overflow-y-auto pb-32 relative">
        <header className="flex justify-between items-center mb-8 bg-[#0d1422] p-5 rounded-xl border border-[#1c2638] shadow-lg">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
              {activeTab === "dashboard" && "Today's AI Predictions"}
              {activeTab === "admin" && "Premium VIP Slips"}
              {activeTab === "scanner" && "AI Slip Validator"}
              {activeTab === "builder" && "Custom Slip Builder"}
            </h1>
            <p className="text-gray-400 text-sm mt-1 hidden md:block">Real-time data analyzed by Sly AI Engine.</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Account Status</p>
             <p className="text-green-500 font-black text-sm flex items-center gap-2 justify-end"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> VIP ACTIVE</p>
          </div>
        </header>

        {isLoading ? (
           <div className="text-center py-20 flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-[#1c2638] border-t-[#1e61d4] rounded-full animate-spin mb-4"></div>
             <h3 className="text-gray-300 font-bold">Syncing Real-Time Data...</h3>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* TAB 1: DASHBOARD (LIVE AI PICKS) */}
            {/* ========================================================= */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-[#1c2638] to-[#0d1422] rounded-xl border border-[#26344d] p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#facc15]/10 rounded-full blur-3xl"></div>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-[#facc15] font-black uppercase tracking-wider text-sm flex items-center gap-2">⭐ Bet of the Day</h2>
                            <span className="bg-[#162032] text-white text-[10px] font-bold px-2 py-1 rounded border border-[#26344d]">{betOfTheDay ? betOfTheDay.asilimia : "90%"} CONFIDENCE</span>
                        </div>
                        {betOfTheDay ? (
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase mb-2">{betOfTheDay.leagueName}</p>
                                <div className="flex justify-between items-end">
                                    <div><p className="text-lg font-black text-white">{betOfTheDay.home}</p><p className="text-lg font-black text-white">{betOfTheDay.away}</p></div>
                                    <div className="text-right"><p className="text-[10px] text-gray-500 uppercase font-bold">AI Pick</p><p className="text-[#facc15] font-black text-xl">{betOfTheDay.ai_tip}</p></div>
                                </div>
                            </div>
                        ) : <p className="text-gray-400 text-sm">Scanning live matches...</p>}
                    </div>

                    {/* AI AUTO GENERATOR ON DASHBOARD */}
                    <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 shadow-xl flex flex-col justify-center">
                        <h2 className="text-purple-400 font-black uppercase tracking-wider text-sm flex items-center gap-2 mb-4">🤖 AI Slip Auto-Generator</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex bg-[#162032] border border-[#26344d] rounded-lg overflow-hidden">
                                <span className="bg-[#1c2638] text-gray-400 font-black px-4 py-3 border-r border-[#26344d]">Target Odds @</span>
                                <input 
                                    type="number" min="1.5" step="0.5"
                                    value={targetOdds} 
                                    onChange={(e) => setTargetOdds(e.target.value)}
                                    className="w-full bg-transparent text-white font-black text-lg px-4 focus:outline-none"
                                />
                            </div>
                            <button 
                                onClick={generateAutoSlip} 
                                disabled={isGenerating}
                                className="w-full bg-gradient-to-r from-purple-600 to-[#1e61d4] text-white font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition transform disabled:opacity-50"
                            >
                                {isGenerating ? "Processing..." : "Generate Magic Slip"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0d1422] border border-[#1c2638] rounded-md shadow-lg overflow-hidden pb-4">
                  <div className="bg-[#090d16] p-4 border-b border-[#1c2638] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <h2 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">Premium AI Selections <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold animate-pulse hidden md:inline-block">● LIVE</span></h2>
                     <div className="relative w-full md:w-64">
                         <input type="text" placeholder="Search team or league..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#162032] border border-[#26344d] text-white text-xs rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:border-[#1e61d4]" />
                         <span className="absolute left-3 top-2.5 text-gray-500 text-xs">🔍</span>
                     </div>
                  </div>

                  {(filteredTop.length > 0 || filteredMore.length > 0) ? (
                    <div className="flex flex-col">
                      {filteredTop.map((ligi: any, index: number) => (
                        <LeagueSection key={`dash-top-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
                      ))}
                      {filteredMore.map((ligi: any, index: number) => (
                        <LeagueSection key={`dash-more-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center"><p className="text-gray-500 font-bold">No matches found for your search.</p></div>
                  )}
                </div>
              </>
            )}

            {/* ========================================================= */}
            {/* TAB 2: ADMIN VIP SLIPS (PAMOJA NA TOP COMBOS) */}
            {/* ========================================================= */}
            {activeTab === "admin" && (
                <section className="max-w-5xl">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-[#facc15] p-4 rounded-r-lg mb-6">
                        <h3 className="text-[#facc15] font-black uppercase text-sm">Premium Acca Combos (Unlocked)</h3>
                        <p className="text-gray-300 text-xs mt-1">Here are your fully unlocked AI-generated Acca Combos for today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {topCombos.map((combo, idx) => (
                           <div key={idx} className="bg-[#0d1422] border border-[#1c2638] rounded-xl p-5 shadow-xl relative overflow-hidden group">
                              <div className="flex justify-between items-center mb-4 border-b border-[#1c2638] pb-3">
                                 <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">{combo.title}</span>
                                    <div className="flex items-center gap-2">
                                       <span className="text-2xl font-black text-[#facc15]">{combo.totalOdds} Odds</span>
                                       <span className={`text-[10px] px-2 py-0.5 rounded font-black ${combo.prob > 60 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{combo.prob}% SURE</span>
                                    </div>
                                 </div>
                                 <button onClick={() => addComboToSlip(combo.matches)} className="bg-[#1e61d4] hover:bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded shadow-lg">Load to Builder</button>
                              </div>
                              
                              <div className="space-y-2">
                                 {combo.matches.map((m: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm bg-[#162032] p-2 rounded">
                                       <span className="text-white font-bold truncate max-w-[180px]">{m.home} vs {m.away}</span>
                                       <span className="text-[#facc15] font-black uppercase">🤖 {m.ai_tip}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-transparent border-l-4 border-purple-500 p-4 rounded-r-lg mb-6 mt-10">
                        <h3 className="text-purple-400 font-black uppercase text-sm">Expert Admin Tickets</h3>
                        <p className="text-gray-300 text-xs mt-1">Ready-made booking codes from 1xBet, Betway, etc.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {adminSlips.length > 0 ? adminSlips.map((slip, i) => (
                           <div key={i} className="bg-[#0d1422] border border-[#1c2638] hover:border-purple-500/50 transition duration-300 rounded-xl p-5 shadow-xl relative group">
                               <div className="absolute top-4 right-4 bg-[#162032] text-purple-400 text-[10px] font-black px-2 py-1 rounded border border-[#26344d]">{slip.bookmaker}</div>
                               <h3 className="text-white font-black text-lg uppercase mb-2 pr-16">{slip.title}</h3>
                               
                               <div className="flex gap-6 mt-4 mb-5 pb-5 border-b border-[#1c2638]">
                                  <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Odds</p><p className="text-3xl font-black text-purple-400">{slip.odds}</p></div>
                                  <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Status</p><p className="text-sm font-black text-green-500 mt-2 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {slip.status}</p></div>
                               </div>
                               
                               <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Booking Code</p>
                                  <div className="flex gap-2">
                                      <div className="bg-[#070b12] border border-[#26344d] text-white font-black px-4 py-3 rounded-lg flex-1 text-center tracking-widest text-lg">{slip.code}</div>
                                      <button onClick={() => showToast(`Code ${slip.code} Copied!`)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-lg font-bold transition shadow-lg">Copy</button>
                                  </div>
                               </div>
                           </div>
                        )) : (
                           <div className="col-span-2 text-center py-20 bg-[#0d1422] border border-[#1c2638] rounded-xl"><p className="text-gray-500 font-bold">No Admin slips available today. Check back later.</p></div>
                        )}
                    </div>
                </section>
            )}

            {/* ========================================================= */}
            {/* TAB 3: AI SLIP SCANNER */}
            {/* ========================================================= */}
            {activeTab === "scanner" && (
                <section className="max-w-2xl mx-auto">
                    <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                        
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                                <span className="text-3xl">🤖</span>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-wider">AI Slip Validator</h2>
                            <p className="text-sm text-gray-400 mt-2">Enter your betting booking code. Our AI will scan the matches and predict your winning probability.</p>
                        </div>

                        <form onSubmit={handleScan} className="mb-8">
                            <div className="flex flex-col md:flex-row gap-3">
                                <input 
                                    type="text" 
                                    value={scanCode} 
                                    onChange={(e) => setScanCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Booking Code (e.g. 8BD7A)" 
                                    className="flex-1 bg-[#070b12] border border-[#26344d] text-white text-center md:text-left text-lg font-black tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:border-purple-500 transition placeholder-gray-600"
                                    required
                                />
                                <button type="submit" disabled={isScanning} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-8 py-4 rounded-lg uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    {isScanning ? <span className="animate-pulse">Scanning...</span> : "Analyze Slip"}
                                </button>
                            </div>
                            <div className="mt-4 p-4 border border-dashed border-[#26344d] rounded-lg text-center cursor-pointer hover:bg-[#162032] transition">
                                <span className="text-2xl mb-2 block">📸</span>
                                <p className="text-sm text-gray-400 font-bold">Or Upload a Screenshot</p>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">(Coming Soon)</p>
                            </div>
                        </form>

                        {scanResult && (
                            <div className={`p-6 rounded-xl border animate-fade-in ${
                                scanResult.status === "RISKY" ? "bg-red-500/10 border-red-500/30" : 
                                scanResult.status === "GOOD" ? "bg-blue-500/10 border-blue-500/30" : 
                                "bg-green-500/10 border-green-500/30"
                            }`}>
                                <div className="flex justify-between items-start mb-4 border-b border-gray-600/30 pb-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Code Scanned</p>
                                        <p className="text-xl font-black text-white">{scanResult.scanned_code}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Win Probability</p>
                                        <p className={`text-3xl font-black ${
                                            scanResult.status === "RISKY" ? "text-red-500" : 
                                            scanResult.status === "GOOD" ? "text-blue-400" : 
                                            "text-green-500"
                                        }`}>{scanResult.win_probability}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">AI Expert Analysis</p>
                                    <p className="text-sm text-gray-200 leading-relaxed font-medium">{scanResult.analysis}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ========================================================= */}
            {/* TAB 4: MY BUILDER */}
            {/* ========================================================= */}
            {activeTab === "builder" && (
                <section className="max-w-4xl mx-auto pb-10">
                    <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 md:p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b border-[#1c2638] pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">My Custom Slip</h2>
                                <p className="text-sm text-gray-400 mt-1">Review your selections.</p>
                            </div>
                            {betslip.length > 0 && <button onClick={() => {setBetslip([]); showToast("Slip Cleared!");}} className="text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded text-[10px] font-black uppercase">Clear All</button>}
                        </div>

                        {betslip.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-[#26344d] rounded-xl bg-[#090d16]">
                                <p className="text-5xl mb-4">🎟️</p>
                                <p className="text-gray-400 font-bold text-lg">Your slip is empty.</p>
                                <p className="text-gray-500 text-sm mt-2 mb-6">Generate an AI slip or add matches manually.</p>
                                <button onClick={() => setActiveTab("dashboard")} className="bg-[#1c2638] hover:bg-[#26344d] text-white px-8 py-3 rounded-lg font-black uppercase text-xs transition border border-[#26344d]">Add Manually</button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    {betslip.map((m: any, i: number) => (
                                        <div key={i} className="bg-[#162032] p-4 md:p-5 rounded-xl border border-[#26344d] flex justify-between items-center hover:border-[#5c98ff]/50 transition">
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{m.leagueName}</p>
                                                <p className="text-sm md:text-base font-black text-white mb-2">{m.home} <span className="text-gray-500 font-normal mx-1">vs</span> {m.away}</p>
                                                <div className="flex gap-2 items-center">
                                                  <span className="bg-[#1e61d4] text-white text-[10px] font-black px-3 py-1 rounded shadow-md">Pick: {m.userPick}</span>
                                                  <span className="text-[#facc15] font-black text-sm">@{m.userOdd}</span>
                                                  {m.userPick === m.ai_tip && (
                                                      <span className="ml-2 text-[10px] text-green-500 font-bold flex items-center gap-1">✅ AI Agreed</span>
                                                  )}
                                                </div>
                                            </div>
                                            <button onClick={() => toggleBetslip(m, m.userPick, m.userOdd)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition" title="Remove">✖</button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-br from-[#070b12] to-[#111a2a] p-6 rounded-xl border border-[#26344d] mb-6 shadow-inner">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      <div className="border-r border-[#1c2638]">
                                        <span className="block text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">Matches</span>
                                        <span className="text-white font-black text-2xl">{betslip.length}</span>
                                      </div>
                                      <div className="md:border-r border-[#1c2638]">
                                        <span className="block text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Odds</span>
                                        <span className="text-[#facc15] font-black text-2xl">{calculateOdds()}</span>
                                      </div>
                                      <div className="col-span-2 md:col-span-1 pt-4 md:pt-0 border-t md:border-t-0 border-[#1c2638]">
                                        <span className="block text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">Win Probability</span>
                                        <span className={`text-2xl font-black ${slipProb >= 70 ? 'text-green-500' : slipProb >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                          {slipProb}%
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-[#1c2638]">
                                      <div className="w-full bg-[#162032] h-2 rounded-full overflow-hidden">
                                         <div className={`h-full rounded-full transition-all duration-1000 ${slipProb >= 70 ? 'bg-green-500' : slipProb >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${Math.min(slipProb, 100)}%`}}></div>
                                      </div>
                                      <p className="text-[10px] text-gray-400 mt-2 text-center font-bold">
                                        {slipProb >= 70 ? "✅ EXCELLENT SLIP! High chance of winning." : slipProb >= 40 ? "⚠️ MEDIUM RISK. Play with caution." : "❌ HIGH RISK! Consider removing some matches to increase safety."}
                                      </p>
                                    </div>
                                </div>

                                <button onClick={() => showToast("Slip Saved Successfully!")} className="w-full bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white font-black py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition transform">
                                    Save & Export Booking Code
                                </button>
                            </>
                        )}
                    </div>
                </section>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* FLOATING SLIP (Ipo kwenye Dashboard pekee) */}
        {/* ========================================================= */}
        {betslip.length > 0 && activeTab === "dashboard" && (
          <div className={`fixed bottom-0 md:bottom-5 right-0 md:right-5 w-full md:w-80 bg-[#0d1422] md:border border-[#1e61d4] rounded-t-xl md:rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-[0_10px_50px_rgba(30,97,212,0.3)] z-50 transition-transform duration-300 ${isSlipOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}`}>
            <div onClick={() => setIsSlipOpen(!isSlipOpen)} className="bg-[#1e61d4] text-white p-4 md:rounded-t-xl cursor-pointer flex justify-between items-center font-black uppercase text-sm">
              <span>🎟️ Betslip ({betslip.length})</span>
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
                <span className="text-gray-400 font-bold uppercase text-xs">Total Odds</span>
                <span className="text-xl font-black text-[#facc15]">{calculateOdds()}</span>
              </div>
              <button onClick={() => { setIsSlipOpen(false); setActiveTab("builder"); }} className="block text-center w-full bg-[#facc15] text-[#070b12] py-3 rounded font-black uppercase text-sm hover:bg-yellow-500 transition shadow-lg shadow-yellow-500/20">
                 Review & Edit Slip
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// =================================================================
// COMPONENT YA JEDWALI (PAMOJA NA OPTIONS)
// =================================================================
function LeagueSection({ ligi, betslip, toggleBetslip }: { ligi: any, betslip: any[], toggleBetslip: any }) {
  const [expanded, setExpanded] = useState(false);
  
  // TUNAONYESHA MECHI 10 TU KWA DEFAULT
  const INITIAL_COUNT = 10;
  const hasMore = ligi.matches?.length > INITIAL_COUNT;
  const visibleMatches = expanded ? ligi.matches : ligi.matches?.slice(0, INITIAL_COUNT);

  return (
    <div className="border-b border-[#1c2638] last:border-0 bg-[#0d1422]">
      <div className="flex items-center gap-3 bg-[#111a2a] px-4 py-3 border-b border-[#1c2638]">
        <span className="text-[16px]">{getSportIcon(ligi.name, ligi.icon)}</span>
        <h2 className="font-black text-xs uppercase tracking-widest text-[#5c98ff]">{ligi.name}</h2>
      </div>
      
      <div className="hidden md:flex bg-[#090d16] px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-[#1c2638]">
         <div className="flex-1">Match Details</div>
         <div className="w-48 text-center border-l border-r border-[#1c2638]">Match Winner (1X2)</div>
         <div className="w-32 text-center">AI Recommend</div>
      </div>

      <div className="flex flex-col">
        {visibleMatches?.map((mkeka: any) => (
           <MatchRow key={mkeka.id} mkeka={mkeka} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
        ))}
      </div>
      {hasMore && !expanded && (
        <div onClick={() => setExpanded(true)} className="text-center py-4 bg-[#162032] text-[#5c98ff] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-[#1e61d4] hover:text-white transition border-t border-[#1c2638]">
          ▼ Show {ligi.matches.length - INITIAL_COUNT} More Matches
        </div>
      )}
    </div>
  );
}

function MatchRow({ mkeka, ligi, betslip, toggleBetslip }: { mkeka: any, ligi: any, betslip: any[], toggleBetslip: any }) {
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
         <div className={`inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded px-2 py-1`}>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest hidden md:inline">🤖 AI: {mkeka.ai_tip}</span>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest md:hidden">🤖 {mkeka.ai_tip}</span>
            <span className="text-[9px] text-green-400 font-bold bg-green-500/20 px-1 rounded">{mkeka.asilimia}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
         {standardOptions.map(group => (
            <div key={group.group} className="flex flex-col bg-[#090d16] p-1.5 rounded border border-[#1c2638]">
               <span className="text-[8px] text-gray-500 font-bold uppercase text-center mb-1">{group.group}</span>
               <div className="flex gap-1">
                  {group.options.map(opt => {
                     const inSlip = betslip.find((m: any) => m.id === mkeka.id && m.userPick === opt.label);
                     const isAiRecommend = aiTarget.includes(opt.label); 
                     
                     return (
                        <button 
                          key={opt.label}
                          onClick={() => toggleBetslip({...mkeka, leagueName: ligi.name}, opt.label, opt.odd)}
                          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded transition relative overflow-hidden ${
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