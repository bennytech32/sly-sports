"use client";
import React from 'react';
import Link from 'next/link';

export default function TipsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black">
      {/* HEADER */}
      <header className="bg-[#0d1422]/90 backdrop-blur-md border-b border-[#1c2638] sticky top-0 z-[110] shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4 max-w-[1500px] mx-auto relative">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)] group-hover:scale-105 transition-transform">
                <span className="text-[#070b12] font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">SPORTS</span></span>
          </Link>
          <Link href="/" className="bg-[#1c2638] text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-wider hover:bg-[#26344d] transition border border-[#26344d] shadow-md hover:shadow-lg">
             ⬅ Back to Home
          </Link>
        </div>
      </header>

      {/* HERO / CONTENT */}
      <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
         <div className="text-center space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-[#60a5fa] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(30,97,212,0.2)]">
               Expert Analysis & AI Predictions
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg leading-tight">
               Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e61d4] to-blue-400">Betting Tips</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
               Access daily AI-driven predictions, in-depth match analysis, and exclusive slips to maximize your winning potential across all major sports.
            </p>
         </div>

         {/* PROFESSIONAL CONTENT CARDS */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            {/* Card 1 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-6 shadow-xl hover:border-[#1e61d4]/50 hover:shadow-[0_0_20px_rgba(30,97,212,0.15)] transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e61d4]/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
               <div className="text-4xl mb-4 text-[#1e61d4]">⚽</div>
               <h3 className="text-white font-black text-lg uppercase mb-2">Football Predictions</h3>
               <p className="text-gray-400 text-xs leading-relaxed">Get accurate AI forecasts for EPL, La Liga, Serie A, and Champions League with detailed stats and win probabilities.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-6 shadow-xl hover:border-[#facc15]/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.1)] transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15]/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
               <div className="text-4xl mb-4 text-[#facc15]">🎾</div>
               <h3 className="text-white font-black text-lg uppercase mb-2">Tennis & Basketball</h3>
               <p className="text-gray-400 text-xs leading-relaxed">Daily safe combos and high-value picks for NBA and ATP/WTA tours, maximizing your ROI.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-6 shadow-xl hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
               <div className="text-4xl mb-4 text-red-500">✈️</div>
               <h3 className="text-white font-black text-lg uppercase mb-2">Aviator Signals</h3>
               <p className="text-gray-400 text-xs leading-relaxed">Live algorithmic signals for crash games. Know exactly when to cash out and secure your profits instantly.</p>
            </div>
         </div>
         
         <div className="text-center mt-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
            <Link href="/" className="inline-block bg-[#1e61d4] hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-black uppercase tracking-wider text-sm shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1">
               View Today's AI Picks
            </Link>
         </div>
      </div>
      
      {/* Inline styles for custom animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
