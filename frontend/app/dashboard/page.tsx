"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [dataYaLigi, setDataYaLigi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  
  // State mpya za Dashboard ya Kibabe
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, builder, results
  const [betslip, setBetslip] = useState<any[]>([]);
  const [safeRoll, setSafeRoll] = useState<any[]>([]);
  const [megaAcca, setMegaAcca] = useState<any[]>([]);

  // 1. KUVUTA DATA NA KUTENGENEZA MIKEKA REAL-TIME
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/mikeka", { cache: "no-store" });
        if (res.ok) {
          let rawData = await res.json();
          const topLeagues = ["Premier League", "La Liga", "Serie A", "Bundesliga", "UEFA Champions League"];
          
          let sortedData = rawData.sort((a: any, b: any) => {
            const aIsTop = topLeagues.some(l => a.name.includes(l));
            const bIsTop = topLeagues.some(l => b.name.includes(l));
            if (aIsTop && !bIsTop) return -1;
            if (!aIsTop && bIsTop) return 1; 
            return 0; 
          });
          
          setDataYaLigi(sortedData);

          // === LOGIC YA AI KUTENGENEZA "MKEKA WA LEO" REAL-TIME ===
          let allMatches: any[] = [];
          sortedData.forEach((ligi: any) => {
            if(ligi.matches) {
                // Tunaongeza jina la ligi kwenye mechi kwa ajili ya display
                const matchesWithLeague = ligi.matches.map((m: any) => ({...m, leagueName: ligi.name}));
                allMatches = [...allMatches, ...matchesWithLeague];
            }
          });

          // Tunapanga mechi kuanzia zenye Asilimia kubwa zaidi (Kama 85% kwenda chini)
          allMatches.sort((a, b) => parseInt(b.asilimia) - parseInt(a.asilimia));

          // Safe Roll: Mechi 2 za uhakika sana (Top 2)
          setSafeRoll(allMatches.slice(0, 2));
          // Mega Acca: Mechi 4 zinazofuata zenye odds nzuri
          setMegaAcca(allMatches.slice(2, 6));
        }
      } catch (error) {
        console.error("Error fetching VIP data:", error);
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

  // Kazi ya Kubadilisha Asilimia kuwa ODDS Halisi (Mf. 80% = 1.25 Odds)
  const getOdds = (probString: string) => {
    const prob = parseInt(probString.replace('%', ''));
    if (!prob || prob === 0) return 1.00;
    // Tunaongeza margin ndogo ya bookie (0.95) kufanya iwe real
    const odds = (100 / prob) * 0.95; 
    return odds < 1.01 ? 1.01 : odds.toFixed(2);
  };

  // Kazi ya Kupiga Hesabu za Mkeka mzima (Total Odds & Probability)
  const calculateSlipStats = (matches: any[]) => {
    if (matches.length === 0) return { totalOdds: "0.00", totalProb: "0%" };
    
    let tOdds = 1;
    let tProbDecimal = 1;

    matches.forEach(m => {
      tOdds *= parseFloat(getOdds(m.asilimia));
      tProbDecimal *= (parseInt(m.asilimia) / 100);
    });

    const finalProb = Math.round(tProbDecimal * 100);
    return { 
      totalOdds: tOdds.toFixed(2), 
      totalProb: finalProb < 1 ? "<1%" : `${finalProb}%` 
    };
  };

  // Kuongeza/Kutoa mechi kwenye Slip Builder
  const toggleBetslip = (match: any) => {
    const exists = betslip.find(m => m.id === match.id);
    if (exists) {
      setBetslip(betslip.filter(m => m.id !== match.id));
      showToast("❌ Removed from Slip");
    } else {
      setBetslip([...betslip, match]);
      showToast("✅ Added to Slip Builder");
    }
  };

  // Data za Mfano za Matokeo ya Jana
  const yesterdayResults = [
    { home: "Arsenal", away: "Aston Villa", tip: "Home Win", result: "2 - 0", won: true },
    { home: "Napoli", away: "Roma", tip: "Over 1.5", result: "1 - 1", won: true },
    { home: "Dortmund", away: "Leipzig", tip: "Home Win", result: "0 - 1", won: false },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-200 font-sans flex flex-col md:flex-row selection:bg-[#facc15] selection:text-black">
      
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#facc15] text-[#070b12] px-6 py-3 rounded-md shadow-2xl z-[100] font-black animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 bg-[#0d1422] border-r border-[#1c2638] flex-shrink-0 sticky top-0 md:h-screen md:overflow-y-auto shadow-xl z-20">
        <div className="p-6 border-b border-[#1c2638] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center">
              <span className="text-[#070b12] font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">VIP</span></span>
          </Link>
        </div>

        <div className="p-4">
          <div className="bg-[#162032] rounded-lg p-4 mb-6 border border-[#26344d] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e61d4] rounded-full flex items-center justify-center text-white font-bold">👤</div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Welcome Boss</p>
              <p className="text-sm text-white font-black">Customer 001</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "dashboard" ? "bg-[#1e61d4]/10 text-[#5c98ff] border-[#1e61d4]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>📊</span> VIP Dashboard
            </button>
            <button onClick={() => setActiveTab("builder")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "builder" ? "bg-[#facc15]/10 text-[#facc15] border-[#facc15]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>🎟️</span> Slip Builder <span className="ml-auto bg-[#facc15] text-[#070b12] text-[10px] px-2 py-0.5 rounded">{betslip.length}</span>
            </button>
            <button onClick={() => setActiveTab("results")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "results" ? "bg-[#1e61d4]/10 text-[#5c98ff] border-[#1e61d4]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
              <span>✅</span> Past Results
            </button>
          </nav>
        </div>

        <div className="p-4 mt-auto">
          <Link href="/" className="flex items-center justify-center gap-2 w-full bg-[#162032] text-gray-400 hover:text-white px-4 py-3 rounded-md font-bold text-sm transition border border-[#26344d] hover:border-red-500 hover:bg-red-500/10">
            <span>🚪</span> Log Out
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 md:h-screen md:overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-[#0d1422] p-5 rounded-xl border border-[#1c2638]">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
              {activeTab === "dashboard" ? "Today's VIP Tips" : activeTab === "builder" ? "My Slip Builder" : "Yesterday's Results"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Live data powered by Sly AI Engine.</p>
          </div>
          {activeTab === "dashboard" && (
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">System Status</p>
              <p className="text-[#facc15] font-bold text-sm flex items-center gap-2"><span className="w-2 h-2 bg-[#facc15] rounded-full animate-pulse"></span> Engine Active</p>
            </div>
          )}
        </header>

        {isLoading ? (
           <div className="text-center py-20 flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-[#1c2638] border-t-[#1e61d4] rounded-full animate-spin mb-4"></div>
             <h3 className="text-gray-300 font-bold">Analyzing Live Matches...</h3>
          </div>
        ) : (
          <>
            {/* ============================================================== */}
            {/* TAB 1: VIP DASHBOARD (MKEKA WA LEO NA MECHI ZOTE) */}
            {/* ============================================================== */}
            {activeTab === "dashboard" && (
              <>
                <section className="mb-10">
                  <h2 className="text-lg font-black uppercase border-l-4 border-[#facc15] pl-3 mb-4 text-white">🔥 Mkeka wa Leo (Auto-Generated)</h2>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* Safe Roll (Inajengwa na API Real-time) */}
                    {safeRoll.length > 0 && (
                      <div className="bg-gradient-to-br from-[#162032] to-[#0d1422] rounded-xl border border-[#26344d] p-5 shadow-lg relative">
                        <div className="absolute top-0 right-0 bg-[#1e61d4] text-white text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider">Safe Roll</div>
                        <div className="flex gap-6 mb-4">
                           <div>
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Odds</p>
                             <p className="text-3xl font-black text-white">{calculateSlipStats(safeRoll).totalOdds}</p>
                           </div>
                           <div>
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Win Prob.</p>
                             <p className="text-3xl font-black text-green-400">{calculateSlipStats(safeRoll).totalProb}</p>
                           </div>
                        </div>
                        <ul className="text-xs text-gray-300 space-y-2 mb-5">
                          {safeRoll.map((m, i) => (
                            <li key={i} className="flex justify-between border-b border-[#26344d] pb-2">
                              <span><b className="text-gray-500">{m.leagueName}:</b> {m.home} vs {m.away}</span> 
                              <span className="text-[#facc15] font-black bg-[#162032] px-2 py-0.5 rounded">{m.ai_tip} <span className="text-gray-500 text-[9px] ml-1">({getOdds(m.asilimia)})</span></span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => showToast("Safe Roll Code Copied!")} className="w-full bg-[#1e61d4] hover:bg-[#2563eb] text-white font-bold text-xs py-3 rounded transition">Copy Safe Roll</button>
                      </div>
                    )}

                    {/* Mega Acca */}
                    {megaAcca.length > 0 && (
                      <div className="bg-gradient-to-br from-[#1c2638] to-[#0d1422] rounded-xl border border-[#facc15]/50 p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)] relative transform md:-translate-y-1">
                        <div className="absolute top-0 right-0 bg-[#facc15] text-[#070b12] text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider">Mega Acca</div>
                        <div className="flex gap-6 mb-4">
                           <div>
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Odds</p>
                             <p className="text-3xl font-black text-[#facc15]">{calculateSlipStats(megaAcca).totalOdds}</p>
                           </div>
                           <div>
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Win Prob.</p>
                             <p className="text-3xl font-black text-[#facc15]">{calculateSlipStats(megaAcca).totalProb}</p>
                           </div>
                        </div>
                        <ul className="text-xs text-gray-300 space-y-2 mb-5">
                          {megaAcca.map((m, i) => (
                            <li key={i} className="flex justify-between border-b border-[#26344d] pb-2">
                              <span><b className="text-gray-500">{m.leagueName}:</b> {m.home} vs {m.away}</span> 
                              <span className="text-white font-black bg-[#162032] px-2 py-0.5 rounded">{m.ai_tip} <span className="text-gray-500 text-[9px] ml-1">({getOdds(m.asilimia)})</span></span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => showToast("Mega Acca Code Copied!")} className="w-full bg-[#facc15] hover:bg-[#eab308] text-[#070b12] font-black text-xs py-3 rounded transition shadow-md">Copy Mega Acca</button>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-black uppercase border-l-4 border-[#1e61d4] pl-3 mb-4 text-white">⚽ All VIP Matches (Click to build slip)</h2>
                  <div className="bg-[#0d1422] border border-[#1c2638] rounded-md shadow-sm">
                    <div className="flex flex-col">
                      {/* Tunafupisha Ligi (Tunaonyesha 5 tu, zingine hazionekani kuepusha urefu) */}
                      {dataYaLigi.slice(0, 5).map((ligi: any, index: number) => (
                        <div key={index} className="border-b border-[#1c2638] last:border-0 bg-[#0d1422]">
                          <div className="flex items-center gap-3 bg-[#162032] px-4 py-2 border-b border-[#1c2638]">
                            {ligi.logo ? <img src={ligi.logo} alt="" className="w-4 h-4 object-contain" /> : <span className="text-[10px]">⚽</span>}
                            <h2 className="font-bold text-xs uppercase tracking-wide text-[#5c98ff]">{ligi.country} - {ligi.name}</h2>
                          </div>
                          <div className="flex flex-col divide-y divide-[#1c2638]/50">
                            {/* Tunafupisha Mechi (3 tu kwa kila ligi) */}
                            {ligi.matches?.slice(0, 3).map((mkeka: any) => {
                              const inSlip = betslip.find(m => m.id === mkeka.id);
                              return (
                                <div key={mkeka.id} className={`p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between transition duration-200 ${inSlip ? 'bg-[#1e61d4]/10' : 'hover:bg-[#111a2a]'}`}>
                                  <div className="flex-1 flex flex-col gap-1 mb-3 md:mb-0">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                      <span className="text-[#facc15]">{mkeka.status}</span> | <span>Prob: {mkeka.asilimia}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-gray-200">{mkeka.home}</h4>
                                    <h4 className="font-bold text-sm text-gray-200">{mkeka.away}</h4>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="bg-[#162032] rounded border border-[#26344d] p-2 text-center w-28">
                                      <span className="block text-[8px] text-gray-500 uppercase font-bold">Odds / Pick</span>
                                      <span className="block font-black text-[#facc15] text-xs truncate">{getOdds(mkeka.asilimia)} <span className="text-white text-[10px]">({mkeka.ai_tip})</span></span>
                                    </div>
                                    <button 
                                      onClick={() => toggleBetslip({...mkeka, leagueName: ligi.name})} 
                                      className={`p-3 rounded font-black text-xs transition ${inSlip ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#1e61d4] text-white hover:bg-[#2563eb]'}`}
                                    >
                                      {inSlip ? "REMOVE" : "+ ADD"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* ============================================================== */}
            {/* TAB 2: SLIP BUILDER */}
            {/* ============================================================== */}
            {activeTab === "builder" && (
              <section className="max-w-2xl mx-auto">
                <div className="bg-[#162032] rounded-xl border border-[#26344d] p-6 shadow-2xl">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">My Custom Slip</h2>
                    <p className="text-sm text-gray-400">Build your own winning ticket using AI picks.</p>
                  </div>

                  {betslip.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-[#26344d] rounded-lg">
                      <p className="text-4xl mb-3">🎟️</p>
                      <p className="text-gray-400 font-bold">Your slip is empty.</p>
                      <button onClick={() => setActiveTab("dashboard")} className="mt-4 bg-[#1e61d4] text-white px-5 py-2 rounded text-xs font-bold">Go Add Matches</button>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                        {betslip.map((m, i) => (
                          <li key={i} className="bg-[#0d1422] p-3 rounded border border-[#26344d] flex justify-between items-center">
                            <div>
                              <p className="text-[9px] text-gray-500 font-bold uppercase">{m.leagueName}</p>
                              <p className="text-sm font-bold text-white">{m.home} vs {m.away}</p>
                              <p className="text-xs text-[#facc15] font-black mt-1">{m.ai_tip} <span className="text-gray-400">@ {getOdds(m.asilimia)}</span></p>
                            </div>
                            <button onClick={() => toggleBetslip(m)} className="text-red-500 bg-red-500/10 p-2 rounded hover:bg-red-500/20">🗑️</button>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-[#070b12] p-4 rounded-lg border border-[#26344d] mb-6">
                        <div className="flex justify-between border-b border-[#26344d] pb-2 mb-2">
                          <span className="text-gray-400 font-bold">Total Matches:</span>
                          <span className="text-white font-black">{betslip.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#26344d] pb-2 mb-2">
                          <span className="text-gray-400 font-bold">Overall Probability:</span>
                          <span className="text-[#facc15] font-black">{calculateSlipStats(betslip).totalProb}</span>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Odds</span>
                          <span className="text-4xl font-black text-[#facc15]">{calculateSlipStats(betslip).totalOdds}</span>
                        </div>
                      </div>

                      <button onClick={() => showToast("Slip Saved! Generating Booking Code...")} className="w-full bg-gradient-to-r from-[#facc15] to-yellow-500 text-[#070b12] font-black py-4 rounded-lg text-sm uppercase tracking-wider shadow-[0_5px_15px_rgba(250,204,21,0.3)] hover:scale-[1.02] transition transform">
                        Generate Booking Code
                      </button>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* ============================================================== */}
            {/* TAB 3: PAST RESULTS */}
            {/* ============================================================== */}
            {activeTab === "results" && (
              <section className="max-w-4xl">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h3 className="text-green-400 font-black uppercase text-sm">Yesterday's Accuracy: 82%</h3>
                    <p className="text-gray-400 text-xs">Sly AI correctly predicted 18 out of 22 premium matches.</p>
                  </div>
                </div>

                <div className="bg-[#0d1422] border border-[#1c2638] rounded-md shadow-sm">
                  <div className="bg-[#162032] p-4 border-b border-[#1c2638] grid grid-cols-12 gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <div className="col-span-6 md:col-span-5">Match</div>
                    <div className="col-span-3 text-center">Prediction</div>
                    <div className="col-span-3 text-center">FT Result</div>
                    <div className="hidden md:block col-span-1 text-center">Status</div>
                  </div>
                  
                  <div className="divide-y divide-[#1c2638]/50">
                    {yesterdayResults.map((r, i) => (
                      <div key={i} className="p-4 grid grid-cols-12 gap-2 items-center hover:bg-[#111a2a] transition">
                        <div className="col-span-6 md:col-span-5">
                          <p className="font-bold text-sm text-gray-200">{r.home}</p>
                          <p className="font-bold text-sm text-gray-200">{r.away}</p>
                        </div>
                        <div className="col-span-3 text-center font-bold text-[#5c98ff] text-xs">{r.tip}</div>
                        <div className="col-span-3 text-center font-black text-white text-sm">{r.result}</div>
                        <div className="hidden md:flex col-span-1 justify-center">
                          {r.won ? (
                            <span className="w-6 h-6 bg-green-500/20 text-green-500 rounded flex items-center justify-center font-bold">✓</span>
                          ) : (
                            <span className="w-6 h-6 bg-red-500/20 text-red-500 rounded flex items-center justify-center font-bold">✗</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}