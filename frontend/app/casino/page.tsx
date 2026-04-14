"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CasinoHacks() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // STATE INAYOSIKILIZA LOGIN

  useEffect(() => {
    // ANGALIA KAMA MTEJA AMELOGIN
    if (localStorage.getItem("slyUser")) {
      setIsLoggedIn(true);
    }
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const casinoGames = [
    { name: "Roulette Pro", type: "Table Game", tip: "Bet on BLACK (Next 3 Spins)", winRate: "82%", status: "Hot" },
    { name: "Sweet Bonanza", type: "Slot", tip: "Buy Free Spins NOW - High RTP Phase", winRate: "94%", status: "Very Hot" },
    { name: "Gates of Olympus", type: "Slot", tip: "Wait 15 mins. RNG is cold.", winRate: "30%", status: "Cold" },
  ];

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans pb-20 md:pb-0 selection:bg-[#facc15] selection:text-black">
      
      {/* HEADER */}
      <header className="bg-[#0d1422] border-b border-[#1c2638] sticky top-0 z-50 shadow-lg p-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#facc15] to-yellow-600 rounded flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <span>🎰</span>
            </div>
            <span className="font-black text-xl text-white">SLY<span className="text-[#facc15]">CASINO</span></span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm transition">← Back Home</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-br from-[#1a1500] to-[#070b12] rounded-2xl border border-[#facc15]/30 p-8 text-center mb-8 relative overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.05)]">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#facc15]/5 rounded-full blur-3xl pointer-events-none"></div>
          <span className="bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/50 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
            🃏 Live RNG Tracker
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Casino <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-yellow-600">Hacks</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Our algorithm scans thousands of live casino spins and slots RTP (Return to Player) rates to find the exact moment machines are ready to pay out.
          </p>
        </div>

        {/* CONTENT */}
        <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#090d16] p-5 border-b border-[#1c2638] flex justify-between items-center">
             <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
               <span className="text-[#facc15]">🔥</span> Hot Games Today
             </h2>
          </div>

          {isLoading ? (
             <div className="p-20 text-center flex flex-col items-center">
               <div className="w-10 h-10 border-4 border-[#1c2638] border-t-[#facc15] rounded-full animate-spin mb-4"></div>
               <p className="text-[#facc15] font-bold uppercase tracking-widest text-sm">Scanning Slot Machines...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
              {casinoGames.map((game, index) => (
                <div key={index} className="bg-[#162032] border border-[#26344d] rounded-lg p-5 relative overflow-hidden group hover:border-[#facc15]/50 transition">
                  
                  {/* KAMA HAJALOGIN - FUNGA KWA PADLOCK */}
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-[#070b12]/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center border border-[#facc15]/20">
                      <span className="text-3xl mb-2">🔒</span>
                      <h3 className="text-[#facc15] font-black uppercase text-xs mb-1">VIP Hack Locked</h3>
                      <p className="text-gray-400 text-[10px] mb-3">Create an account to see the exact spin strategies.</p>
                      <Link href="/login" className="bg-gradient-to-r from-[#facc15] to-yellow-600 text-black px-6 py-2 rounded font-black text-xs uppercase hover:scale-105 transition transform shadow-lg">Login to Reveal</Link>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-black text-lg">{game.name}</h3>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{game.type}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${game.status.includes('Hot') ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                      {game.status}
                    </span>
                  </div>

                  <div className="bg-[#070b12] p-3 rounded border border-[#1c2638] mb-4">
                    <span className="block text-[9px] text-[#facc15] uppercase font-bold mb-1">AI Recommendation</span>
                    <p className="text-sm font-bold text-gray-200 leading-tight">{game.tip}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Predicted Win Rate</span>
                    <span className="text-lg font-black text-white">{game.winRate}</span>
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