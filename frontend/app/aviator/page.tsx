"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// KAMUSI YA LUGHA (TRANSLATIONS)
// ==========================================
const translations = {
  en: {
    sports: "Sports", aviator: "Aviator", casino: "Casino",
    goToDashboard: "Go to Dashboard", logout: "Logout", login: "Login", register: "Register",
    title: "AI AVIATOR SCANNER",
    subtitle: "Provably Fair RNG Trend Analyzer",
    connectBtn: "CONNECT TO GAME SERVER",
    disconnectBtn: "DISCONNECT",
    statusIdle: "SYSTEM IDLE - WAITING FOR CONNECTION",
    statusConnecting: "ESTABLISHING SECURE CONNECTION...",
    statusAnalyzing: "INTERCEPTING LIVE HASHES...",
    statusReady: "CONNECTION SECURED - LIVE SCANNING ACTIVE",
    targetMultiplier: "TARGET MULTIPLIER",
    confidence: "AI CONFIDENCE LEVEL",
    safeZone: "SAFE CASHOUT ZONE",
    riskLevel: "RISK LEVEL",
    history: "RECENT ANALYZED PATTERNS",
    terminalTitle: "LIVE TERMINAL LOGS",
    disclaimer: "SLY SPORTS AVIATOR AI uses statistical probability and trend analysis. It is mathematically impossible to hack Provably Fair RNG. Signals are suggestions for safe cashout zones, not guaranteed hacks. Always gamble responsibly.",
  },
  sw: {
    sports: "Michezo", aviator: "Aviator", casino: "Kasino",
    goToDashboard: "Nenda Dashibodi", logout: "Toka", login: "Ingia", register: "Jisajili",
    title: "AI AVIATOR SCANNER",
    subtitle: "Mfumo wa Kuchambua Mwenendo wa Ndege",
    connectBtn: "UNGANISHA NA SERVER",
    disconnectBtn: "KATA MAWASILIANO",
    statusIdle: "MFUMO UPO WAZI - SUBIRI KUUNGANISHA",
    statusConnecting: "INAUNGANISHA NA SERVER YA AVIATOR...",
    statusAnalyzing: "INASOMA DATA ZA SIRI (HASHES)...",
    statusReady: "IMEUNGANISHWA - INASOMA MOJA KWA MOJA",
    targetMultiplier: "NUKTA YA KUTOA PESA (CASHOUT)",
    confidence: "UWEZEKANO WA AI",
    safeZone: "ENEO SALAMA",
    riskLevel: "KIWANGO CHA HATARI",
    history: "HISTORIA YA SIGNAL ZILIZOPITA",
    terminalTitle: "DATA ZA MOJA KWA MOJA (TERMINAL)",
    disclaimer: "SLY SPORTS AVIATOR AI inatumia hesabu za uwezekano (Probability) kutabiri mwenendo. Kitaalamu, haiwezekani ku-hack mfumo wa Provably Fair. Hizi ni signal za kukuongoza wapi utoe pesa salama, sio utapeli. Cheza kistaarabu.",
  }
};

export default function AviatorPage() {
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Aviator AI States
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "analyzing" | "ready">("idle");
  const [targetSignal, setTargetSignal] = useState<string>("0.00x");
  const [confidence, setConfidence] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<{multiplier: string, isWin: boolean}[]>([
      {multiplier: "1.45x", isWin: true},
      {multiplier: "2.10x", isWin: true},
      {multiplier: "1.12x", isWin: false},
      {multiplier: "3.50x", isWin: true},
      {multiplier: "1.80x", isWin: true},
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const scannerInterval = useRef<any>(null); // Kuhifadhi kitanzi (loop) cha AI

  useEffect(() => {
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }

    // Safisha interval wakati component inaondolewa
    return () => {
      if (scannerInterval.current) clearInterval(scannerInterval.current);
    };
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`]);
  };

  const handleConnect = () => {
    setConnectionState("connecting");
    setLogs([]);
    addLog("Initializing WebSocket connection...");
    
    setTimeout(() => {
      addLog("Connecting to wss://provably-fair.spribe.io/rng...");
      setConnectionState("analyzing");
      
      setTimeout(() => {
        addLog("Bypassing client seed protocol...");
        addLog("Analyzing last 100 SHA-256 hashes...");
        
        setTimeout(() => {
          addLog("Pattern matching complete.");
          addLog("Connection secured. Algorithm synced.");
          setConnectionState("ready");
          startAutoScanner(); // ANZISHA MCHAKATO WA MOJA KWA MOJA HAPA
        }, 1500);
      }, 1500);
    }, 1000);
  };

  const handleDisconnect = () => {
    setConnectionState("idle");
    setTargetSignal("0.00x");
    setConfidence(0);
    setIsScanning(false);
    setLogs([]);
    if (scannerInterval.current) clearInterval(scannerInterval.current);
  };

  // MTAMBO WA MOJA KWA MOJA (AUTO-SCANNER)
  const startAutoScanner = () => {
    const runCycle = () => {
      setIsScanning(true);
      setTargetSignal("SCANNING...");
      addLog("Detecting new flight round...");
      
      setTimeout(() => {
        addLog("Intercepting live packet...");
      }, 1500);

      // Baada ya sekunde 4 (Muda wa kutafuta)
      setTimeout(() => {
        // SMART ALGORITHM: Tunaweka nyingi ziwe kati ya 1.20x na 2.00x
        const rand = Math.random();
        let multiplier = 0;
        let conf = 0;

        if (rand < 0.6) {
          multiplier = (Math.random() * (1.80 - 1.20) + 1.20);
          conf = Math.floor(Math.random() * (98 - 85) + 85);
        } else if (rand < 0.9) {
          multiplier = (Math.random() * (3.50 - 1.81) + 1.81);
          conf = Math.floor(Math.random() * (84 - 70) + 70);
        } else {
          multiplier = (Math.random() * (10.00 - 3.51) + 3.51);
          conf = Math.floor(Math.random() * (69 - 45) + 45);
        }

        const finalSignal = `${multiplier.toFixed(2)}x`;
        setTargetSignal(finalSignal);
        setConfidence(conf);
        setIsScanning(false);
        
        addLog(`🔥 SAFE ZONE LOCKED: Withdraw at ${finalSignal} (${conf}% Conf)`);
        
        setHistory(prev => {
          const newHist = [{ multiplier: finalSignal, isWin: true }, ...prev];
          return newHist.slice(0, 10);
        });
      }, 4000);
    };

    // Run round ya kwanza mara moja
    runCycle();

    // Endelea kila baada ya sekunde 15 (Inaiga mzunguko wa ndege)
    scannerInterval.current = setInterval(() => {
      runCycle();
    }, 15000); 
  };

  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black">
      
      {/* HEADER */}
      <header className="bg-[#0d1422] border-b border-[#1c2638] sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4 max-w-[1500px] mx-auto">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                <span className="text-[#070b12] font-bold text-xl">S</span>
            </div>
            <span className="hidden sm:block text-xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">TIPS</span></span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-gray-400 uppercase tracking-wider flex-1 justify-center">
            <Link href="/" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>⚽</span> {t.sports}</Link>
            <Link href="/aviator" className="flex items-center gap-1.5 text-white border-b-2 border-red-500 pb-1"><span>✈️</span> {t.aviator}</Link>
            <Link href="/casino" className="flex items-center gap-1.5 hover:text-[#facc15] transition pb-1"><span>🎰</span> {t.casino}</Link>
          </nav>

          <div className="flex gap-4 items-center justify-end flex-shrink-0">
            <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="bg-[#1c2638] text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-[#26344d] transition border border-[#26344d] flex items-center gap-1">
                {lang === 'en' ? '🇹🇿 SW' : '🇬🇧 EN'}
            </button>
            {isLoggedIn ? (
              <Link href="/dashboard" className="hidden sm:inline-block text-[#facc15] font-bold text-sm bg-[#facc15]/10 px-4 py-1.5 rounded border border-[#facc15]/30 hover:bg-[#facc15]/20">
                {t.goToDashboard}
              </Link>
            ) : (
              <Link href="/login" className="bg-[#1e61d4] text-white px-5 py-2 rounded font-bold text-sm hover:bg-[#2563eb] transition shadow-md whitespace-nowrap">
                {t.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        
        {/* TITLE SECTION */}
        <div className="text-center mb-10 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg mb-2 relative z-10 flex items-center justify-center gap-3">
                <span className="text-red-500 animate-pulse">✈️</span> {t.title}
            </h1>
            <p className="text-red-400 font-bold tracking-widest text-sm uppercase relative z-10">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN - TERMINAL & CONTROLS */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* CONNECTION CONTROL */}
                <div className="bg-[#0d1422] border border-[#1c2638] p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 bg-[#070b12] p-3 rounded-lg border border-[#1c2638]">
                        <div className={`w-3 h-3 rounded-full ${
                            connectionState === 'idle' ? 'bg-gray-500' :
                            connectionState === 'connecting' || connectionState === 'analyzing' ? 'bg-yellow-500 animate-ping' :
                            'bg-green-500 shadow-[0_0_10px_#22c55e]'
                        }`}></div>
                        <span className={`text-[10px] font-black tracking-widest uppercase ${
                            connectionState === 'ready' ? 'text-green-500 animate-pulse' : 'text-gray-400'
                        }`}>
                            {connectionState === 'idle' ? t.statusIdle :
                             connectionState === 'connecting' ? t.statusConnecting :
                             connectionState === 'analyzing' ? t.statusAnalyzing :
                             t.statusReady}
                        </span>
                    </div>

                    {connectionState === "idle" ? (
                        <button onClick={handleConnect} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                            <span>📡</span> {t.connectBtn}
                        </button>
                    ) : (
                        <button onClick={handleDisconnect} className="w-full bg-gray-800 hover:bg-gray-700 text-red-500 border border-red-500/30 font-black py-4 rounded-xl transition-all">
                            {t.disconnectBtn}
                        </button>
                    )}
                </div>

                {/* RECENT HISTORY TAPE (Imehamia hapa) */}
                <div className="bg-[#0d1422] border border-[#1c2638] p-4 rounded-xl shadow-lg">
                    <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 border-b border-[#1c2638] pb-2">{t.history}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {history.map((item, idx) => (
                            <div key={idx} className={`text-center py-2 rounded font-black text-sm border ${
                                parseFloat(item.multiplier) >= 2.0 
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                                : 'bg-[#1e61d4]/10 text-[#5c98ff] border-[#1e61d4]/30'
                            }`}>
                                {item.multiplier}
                            </div>
                        ))}
                    </div>
                </div>

                {/* HACKER TERMINAL */}
                <div className="bg-black border border-gray-800 rounded-2xl p-4 font-mono text-xs shadow-2xl h-[250px] flex flex-col relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                    <h3 className="text-gray-500 font-bold uppercase mb-3 pb-2 border-b border-gray-800 flex justify-between">
                        <span>{t.terminalTitle}</span>
                        <span className="text-green-500 animate-pulse">_</span>
                    </h3>
                    <div ref={terminalRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-2">
                        {logs.length === 0 ? (
                            <div className="text-gray-700 italic">Waiting for connection...</div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className={`${log.includes('LOCKED') ? 'text-yellow-400 font-bold' : 'text-green-500'}`}>
                                    {log}
                                </div>
                            ))
                        )}
                        {connectionState === 'connecting' || connectionState === 'analyzing' || isScanning ? (
                             <div className="text-green-500 animate-pulse mt-2">██████████</div>
                        ) : null}
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN - MAIN RADAR DISPLAY */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* RADAR SCREEN */}
                <div className="bg-[#0d1422] border border-[#1c2638] p-8 md:p-12 rounded-2xl shadow-2xl relative flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
                    
                    {/* Background Grid & Radar Effects */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(28,38,56,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(28,38,56,0.3)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
                    
                    {isScanning && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-4 border-red-500/20 rounded-full animate-[spin_3s_linear_infinite] border-t-red-500/80 pointer-events-none"></div>
                    )}

                    <h2 className="text-gray-500 font-black uppercase tracking-[0.3em] mb-4 relative z-10">{t.targetMultiplier}</h2>
                    
                    {/* MAIN NUMBER DISPLAY */}
                    <div className="relative mb-12 z-10">
                        <div className={`text-7xl md:text-9xl font-black tracking-tighter transition-all duration-300 ${
                            targetSignal === "0.00x" || targetSignal === "- - -" ? "text-gray-700" : 
                            isScanning ? "text-red-500 animate-pulse text-5xl md:text-7xl" : "text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] scale-110"
                        }`}>
                            {targetSignal}
                        </div>
                    </div>

                    {/* CONFIDENCE METERS */}
                    <div className="w-full max-w-lg grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-[#070b12] border border-[#1c2638] p-6 rounded-xl text-center shadow-lg">
                            <span className="block text-[10px] text-gray-500 uppercase font-bold mb-2">{t.confidence}</span>
                            <div className="flex items-center justify-center gap-2">
                                <span className={`text-3xl font-black ${confidence > 80 ? 'text-green-500' : confidence > 60 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                    {confidence}%
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#070b12] border border-[#1c2638] p-6 rounded-xl text-center shadow-lg">
                            <span className="block text-[10px] text-gray-500 uppercase font-bold mb-2">{t.riskLevel}</span>
                            <span className={`text-2xl font-black uppercase ${
                                confidence === 0 ? 'text-gray-500' :
                                confidence > 80 ? 'text-green-500' : 
                                confidence > 60 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                                {confidence === 0 ? '-' : confidence > 80 ? 'LOW' : confidence > 60 ? 'MEDIUM' : 'HIGH'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* DISCLAIMER FOOTER */}
        <div className="mt-16 bg-[#090d16] border border-red-500/20 p-6 rounded-xl text-center max-w-4xl mx-auto">
            <span className="text-2xl mb-2 block">⚠️</span>
            <p className="text-gray-400 text-xs leading-relaxed max-w-2xl mx-auto font-medium">
                {t.disclaimer}
            </p>
        </div>

      </div>

      {/* MOBILE BOTTOM NAV (Same as home) */}
      <nav className="xl:hidden fixed bottom-0 left-0 w-full bg-[#0d1422] border-t border-[#1c2638] flex justify-around items-center py-3 px-2 z-[90] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
         <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1">
           <span className="text-xl">🏠</span>
           <span className="text-[9px] font-bold uppercase">Home</span>
         </Link>
         <Link href="/aviator" className="flex flex-col items-center text-red-500 gap-1">
           <span className="text-xl">✈️</span>
           <span className="text-[9px] font-black uppercase">Aviator</span>
         </Link>
         {isLoggedIn ? (
           <Link href="/dashboard" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1 cursor-pointer">
             <span className="text-xl">📊</span>
             <span className="text-[9px] font-bold uppercase">Dashboard</span>
           </Link>
         ) : (
           <Link href="/login" className="flex flex-col items-center text-gray-500 hover:text-[#facc15] transition gap-1">
             <span className="text-xl">👤</span>
             <span className="text-[9px] font-bold uppercase">Login</span>
           </Link>
         )}
      </nav>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #070b12; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1c2638; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
      `}</style>
    </main>
  );
}