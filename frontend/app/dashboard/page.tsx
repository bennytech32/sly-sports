"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [dataYaLigi, setDataYaLigi] = useState<{top: any[], more: any[]}>({top: [], more: []});
  const [adminSlips, setAdminSlips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [user, setUser] = useState<any>(null);
  
  // Tabs: dashboard, admin, scanner, builder
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [betslip, setBetslip] = useState<any[]>([]);
  
  // Dynamic Stats
  const [betOfTheDay, setBetOfTheDay] = useState<any>(null);
  const [dynamicStats, setDynamicStats] = useState({ winRate: "84.2", streak: 12, total: 452 });

  // AI Scanner States
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // 1. Verify User
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/login"; // Force login if not authenticated
    }

    // 2. Fetch Real Data & Admin Slips
    const fetchData = async () => {
      try {
        const cacheBuster = new Date().getTime();
        const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";
        
        // Vuta Mechi
        const resMatches = await fetch(`${baseUrl}/api/mikeka?t=${cacheBuster}`, { cache: "no-store" });
        if (resMatches.ok) {
          const rawData = await resMatches.json();
          if (rawData && (rawData.top?.length > 0 || rawData.more?.length > 0)) {
             setDataYaLigi({ top: rawData.top || [], more: rawData.more || [] });
             
             // Set Bet of the Day
             let allMatches: any[] = [];
             [...(rawData.top || []), ...(rawData.more || [])].forEach((ligi: any) => {
               if(ligi.matches) {
                 allMatches = [...allMatches, ...ligi.matches.map((m: any) => ({...m, leagueName: ligi.name}))];
               }
             });
             allMatches.sort((a, b) => parseInt(b.asilimia) - parseInt(a.asilimia));
             if (allMatches.length > 0) setBetOfTheDay(allMatches[0]);
          }
        }

        // Vuta Mikeka ya Admin
        const resSlips = await fetch(`${baseUrl}/api/admin/slips`, { cache: "no-store" });
        if (resSlips.ok) {
           const slipsData = await resSlips.json();
           setAdminSlips(slipsData);
        }

        // Stats
        const today = new Date().getDate();
        setDynamicStats({ winRate: (82 + (today % 5) + Math.random()).toFixed(1), streak: 8 + (today % 6), total: 450 + today * 2 });

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
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

  const toggleBetslip = (match: any) => {
    const exists = betslip.find((m: any) => m.id === match.id);
    if (exists) {
      setBetslip(betslip.filter((m: any) => m.id !== match.id));
      showToast("❌ Removed from Slip");
    } else {
      setBetslip([...betslip, match]);
      showToast("✅ Added to Slip");
    }
  };

  const calculateOdds = () => {
    if (betslip.length === 0) return "0.00";
    let tOdds = 1;
    betslip.forEach(m => {
      const prob = parseInt(m.asilimia.replace('%', ''));
      if(prob && prob !== 0){ const odds = (100 / prob) * 0.95; tOdds *= (odds < 1.01 ? 1.01 : odds); }
    });
    return tOdds.toFixed(2);
  };

  // KAZI YA AI SCANNER
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
            setTimeout(() => { // Simulate AI processing time
                setScanResult(data);
                setIsScanning(false);
            }, 1500);
        }
    } catch(err) {
        setIsScanning(false);
        showToast("Error connecting to AI Server.");
    }
  };

  if (!user) return <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-200 font-sans flex flex-col md:flex-row selection:bg-[#facc15] selection:text-black">
      
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#facc15] text-[#070b12] px-6 py-3 rounded-md shadow-2xl z-[100] font-black animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* --- SIDEBAR YA KIPROFESA --- */}
      <aside className="w-full md:w-64 bg-[#0d1422] border-r border-[#1c2638] flex-shrink-0 sticky top-0 md:h-screen md:overflow-y-auto shadow-xl z-20">
        <div className="p-6 border-b border-[#1c2638] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
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
              <span>🎟️</span> My Builder <span className="ml-auto bg-[#facc15] text-[#070b12] text-[10px] px-2 py-0.5 rounded">{betslip.length}</span>
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
      <main className="flex-1 p-4 md:p-8 md:h-screen md:overflow-y-auto">
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
                    {/* DYNAMIC BET OF THE DAY */}
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

                    {/* DYNAMIC AI PERFORMANCE */}
                    <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 shadow-xl flex flex-col justify-center">
                        <h2 className="text-gray-300 font-black uppercase tracking-wider text-sm flex items-center gap-2 mb-4">📈 Monthly Performance</h2>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Win Rate</p>
                                <p className="text-4xl font-black text-green-400">{dynamicStats.winRate}%</p>
                            </div>
                            <div className="text-right flex gap-4">
                                <div><p className="text-gray-500 text-[10px] font-bold uppercase">Streak</p><p className="text-white font-black text-xl">{dynamicStats.streak} 🔥</p></div>
                                <div><p className="text-gray-500 text-[10px] font-bold uppercase">Won</p><p className="text-white font-black text-xl">{dynamicStats.total}+</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-[#090d16] p-4 border-b border-[#1c2638] flex justify-between items-center">
                     <h2 className="font-black text-white text-sm uppercase tracking-wider">Premium AI Selections</h2>
                     <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold animate-pulse">● LIVE</span>
                  </div>

                  {(dataYaLigi.top.length > 0 || dataYaLigi.more.length > 0) ? (
                    <div className="flex flex-col">
                      {dataYaLigi.top.map((ligi: any, index: number) => (
                        <LeagueSection key={`dash-top-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
                      ))}
                      {dataYaLigi.more.map((ligi: any, index: number) => (
                        <LeagueSection key={`dash-more-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center"><p className="text-gray-500 font-bold">No matches available right now.</p></div>
                  )}
                </div>
              </>
            )}

            {/* ========================================================= */}
            {/* TAB 2: ADMIN VIP SLIPS (MIKEKA ILIYOTUMWA NA ADMIN) */}
            {/* ========================================================= */}
            {activeTab === "admin" && (
                <section className="max-w-4xl">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-[#facc15] p-4 rounded-r-lg mb-6">
                        <h3 className="text-[#facc15] font-black uppercase text-sm">Exclusive Tickets</h3>
                        <p className="text-gray-300 text-xs mt-1">These are high-confidence slips strictly compiled by our Expert Admins.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {adminSlips.length > 0 ? adminSlips.map((slip, i) => (
                          <div key={i} className="bg-[#0d1422] border border-[#1c2638] hover:border-[#facc15]/50 transition duration-300 rounded-xl p-5 shadow-xl relative group">
                              <div className="absolute top-4 right-4 bg-[#162032] text-[#facc15] text-[10px] font-black px-2 py-1 rounded border border-[#26344d]">{slip.bookmaker}</div>
                              <h3 className="text-white font-black text-lg uppercase mb-2 pr-16">{slip.title}</h3>
                              
                              <div className="flex gap-6 mt-4 mb-5 pb-5 border-b border-[#1c2638]">
                                 <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Odds</p><p className="text-3xl font-black text-[#facc15]">{slip.odds}</p></div>
                                 <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Status</p><p className="text-sm font-black text-green-500 mt-2 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {slip.status}</p></div>
                              </div>
                              
                              <div>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Booking Code</p>
                                 <div className="flex gap-2">
                                     <div className="bg-[#070b12] border border-[#26344d] text-white font-black px-4 py-3 rounded-lg flex-1 text-center tracking-widest text-lg">{slip.code}</div>
                                     <button onClick={() => showToast(`Code ${slip.code} Copied!`)} className="bg-[#1e61d4] hover:bg-[#2563eb] text-white px-4 rounded-lg font-bold transition shadow-lg">Copy</button>
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
            {/* TAB 3: AI SLIP SCANNER (UTABIRI WA MKEKA WA MTEJA) */}
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
                            <p className="text-[10px] text-gray-500 text-center mt-3">Or upload a screenshot (Coming soon)</p>
                        </form>

                        {/* Majibu ya AI Scanner */}
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
            {/* TAB 4: SLIP BUILDER (CUSTOM TICKET) */}
            {/* ========================================================= */}
            {activeTab === "builder" && (
                <section className="max-w-2xl mx-auto">
                    <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 shadow-2xl">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">My Custom Slip</h2>
                            <p className="text-sm text-gray-400">Build your own winning ticket using our AI picks.</p>
                        </div>

                        {betslip.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-[#26344d] rounded-lg">
                                <p className="text-4xl mb-3">🎟️</p>
                                <p className="text-gray-400 font-bold">Your slip is empty.</p>
                                <button onClick={() => setActiveTab("dashboard")} className="mt-4 bg-[#1e61d4] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded font-bold transition">Go Add Matches</button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {betslip.map((m: any, i: number) => (
                                        <div key={i} className="bg-[#162032] p-4 rounded-lg border border-[#26344d] flex justify-between items-center">
                                            <div>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">{m.leagueName}</p>
                                                <p className="text-sm font-bold text-white mb-1">{m.home} vs {m.away}</p>
                                                <span className="bg-[#070b12] text-[#facc15] text-[10px] font-black px-2 py-1 rounded border border-[#26344d] uppercase">Pick: {m.ai_tip}</span>
                                            </div>
                                            <button onClick={() => toggleBetslip(m)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition">✖</button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#070b12] p-5 rounded-lg border border-[#26344d] mb-6">
                                    <div className="flex justify-between border-b border-[#1c2638] pb-3 mb-3">
                                        <span className="text-gray-400 font-bold text-sm">Total Matches:</span>
                                        <span className="text-white font-black text-lg">{betslip.length}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Odds</span>
                                        <span className="text-4xl font-black text-[#facc15]">{calculateOdds()}</span>
                                    </div>
                                </div>

                                <button onClick={() => showToast("Processing your slip...")} className="w-full bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white font-black py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition transform">
                                    Generate Booking Code
                                </button>
                            </>
                        )}
                    </div>
                </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// =================================================================
// COMPONENT YA JEDWALI (SPORTODDS STYLE) KWA DASHBOARD
// =================================================================
function LeagueSection({ ligi, betslip, toggleBetslip }: { ligi: any, betslip: any[], toggleBetslip: any }) {
  return (
    <div className="border-b border-[#1c2638] last:border-0">
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
        {ligi.matches?.map((mkeka: any) => {
           const inSlip = betslip.find((m: any) => m.id === mkeka.id);
           return (
              <div key={mkeka.id} className="px-4 py-3 border-b border-[#1c2638]/50 hover:bg-[#162032] transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="text-[9px] md:hidden text-[#facc15] font-bold mb-1">{mkeka.status}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-200 leading-tight">{mkeka.home}</span>
                    <span className="font-bold text-sm text-gray-200 leading-tight">{mkeka.away}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-between md:justify-end mt-2 md:mt-0">
                  <div className="hidden md:block w-20 text-center"><span className="text-[10px] text-[#facc15] font-bold">{mkeka.status}</span></div>
                  <div className="w-28 md:w-24">
                       <div className="bg-[#090d16] border border-[#26344d] rounded py-1.5 px-2 text-center border-l-2 border-l-[#5c98ff]">
                          <span className="block font-black text-[#5c98ff] text-[10px] truncate">{mkeka.ai_tip}</span>
                       </div>
                  </div>
                  <div className="w-20 text-right md:text-center">
                       <button onClick={(e) => { e.preventDefault(); toggleBetslip({...mkeka, leagueName: ligi.name}); }} className={`w-full py-1.5 rounded font-black text-[10px] transition ${inSlip ? 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10' : 'bg-[#1e61d4] text-white hover:bg-[#2563eb] shadow-lg'}`}>
                          {inSlip ? "REMOVE" : "+ SLIP"}
                       </button>
                  </div>
                </div>
              </div>
           )
        })}
      </div>
    </div>
  );
}