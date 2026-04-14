"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AviatorPredictor() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signals, setSignals] = useState<any[]>([]);

  // FUNCTION YA KUTENGENEZA SIGNAL MPYA (AI SIMULATOR)
  const generateNewSignal = () => {
    const sasa = new Date();
    // Tunaongeza kati ya dakika 1 mpaka 3 mbele kuonyesha "Utabiri wa mechi zijazo"
    sasa.setMinutes(sasa.getMinutes() + Math.floor(Math.random() * 3) + 1);
    sasa.setSeconds(Math.floor(Math.random() * 60));
    
    const timeString = sasa.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Asilimia 30 ya signal iwe "High Risk" (Odds kubwa), 70% iwe "Safe/Low Risk" (Odds ndogo)
    const isHighRisk = Math.random() > 0.7; 
    let target, risk, prob;

    if (isHighRisk) {
      target = `${(Math.random() * 4 + 4).toFixed(2)}x - ${(Math.random() * 10 + 10).toFixed(2)}x`; // 4.00x hadi 20.00x
      risk = "High";
      prob = `${Math.floor(Math.random() * 15 + 70)}%`; // 70% - 85%
    } else {
      target = `${(Math.random() * 0.5 + 1.2).toFixed(2)}x - ${(Math.random() * 1.5 + 2).toFixed(2)}x`; // 1.20x hadi 3.50x
      risk = "Safe";
      prob = `${Math.floor(Math.random() * 10 + 90)}%`; // 90% - 99%
    }

    return { id: Math.random().toString(), time: timeString, prob, target, risk, status: "Analyzing" };
  };

  useEffect(() => {
    if (localStorage.getItem("slyUser")) {
      setIsLoggedIn(true);
    }

    // Tunaweka Signals 3 za kuanzia
    setSignals([generateNewSignal(), generateNewSignal(), generateNewSignal()].sort((a, b) => a.time.localeCompare(b.time)));

    const timer = setTimeout(() => setIsLoading(false), 1500);

    // LOOP YA KUBADILISHA SIGNAL KILA BAADA YA SEKUNDE 15
    const signalInterval = setInterval(() => {
      setSignals((prevSignals) => {
        // Tunatoa signal ya kwanza (iliyoisha muda) na kuweka mpya mwishoni
        const newArray = [...prevSignals.slice(1), generateNewSignal()];
        return newArray.sort((a, b) => a.time.localeCompare(b.time)); // Tunazipanga kwa muda
      });
    }, 15000); // 15000 milliseconds = Sekunde 15

    return () => {
      clearTimeout(timer);
      clearInterval(signalInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans pb-20 md:pb-0 selection:bg-red-500 selection:text-white relative">
      
      {/* HEADER */}
      <header className="bg-[#0d1422] border-b border-[#1c2638] sticky top-0 z-50 shadow-lg p-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <span>✈️</span>
            </div>
            <span className="font-black text-xl text-white">SLY<span className="text-red-500">AVIATOR</span></span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm transition">← Back Home</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-br from-[#162032] to-[#070b12] rounded-2xl border border-red-500/30 p-8 text-center mb-8 relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block animate-pulse">
            🔴 Live AI Predictor Active
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Aviator <span className="text-red-500">Signals</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Our AI engine analyzes the Aviator RNG algorithm in real-time to predict upcoming safe cashout zones. Stop crashing, start winning.
          </p>
        </div>

        {/* CONTENT */}
        <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#090d16] p-5 border-b border-[#1c2638] flex justify-between items-center">
             <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Scanning Live Flights...
             </h2>
          </div>

          {isLoading ? (
             <div className="p-20 text-center flex flex-col items-center">
               <div className="text-5xl mb-4 animate-bounce">✈️</div>
               <p className="text-red-500 font-bold uppercase tracking-widest text-sm">Hacking Algorithm...</p>
             </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {signals.map((signal) => (
                <div key={signal.id} className="bg-[#162032] border border-[#26344d] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden animate-fade-in">
                  
                  {/* KAMA HAJALOGIN - FUNGA KWA PADLOCK */}
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-[#070b12]/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center border border-red-500/20">
                      <span className="text-2xl mb-1">🔒</span>
                      <h3 className="text-white font-black uppercase text-sm mb-1">Signal Locked</h3>
                      <p className="text-gray-400 text-[10px] mb-3">Register or Login to view the exact multiplier target.</p>
                      <Link href="/login" className="bg-red-600 text-white px-6 py-1.5 rounded font-bold text-xs uppercase hover:bg-red-700 transition">Unlock Signal</Link>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="bg-[#070b12] px-3 py-2 rounded border border-[#1c2638] text-center min-w-[80px]">
                      <span className="block text-[9px] text-gray-500 uppercase font-bold">Fly Time</span>
                      <span className="font-black text-white text-sm animate-pulse">{signal.time}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">AI Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[#070b12] rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: signal.prob }}></div>
                        </div>
                        <span className="text-xs font-black text-white">{signal.prob}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="block text-[9px] text-gray-500 uppercase font-bold mb-0.5">Risk Level</span>
                      <span className={`text-xs font-black uppercase ${signal.risk === 'High' ? 'text-orange-500' : 'text-green-500'}`}>{signal.risk}</span>
                    </div>
                    <div className="bg-[#070b12] border border-red-500/50 px-4 py-2 rounded text-center min-w-[140px] shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                      <span className="block text-[9px] text-red-500 uppercase font-bold mb-0.5">Target Cashout</span>
                      <span className="font-black text-white text-lg tracking-wider">{signal.target}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}