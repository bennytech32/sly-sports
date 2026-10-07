"use client";
import React from 'react';
import Link from 'next/link';

export default function TrendingCampaignsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#ef4444]/10 rounded-full blur-[150px] pointer-events-none"></div>

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
      <div className="max-w-[1000px] mx-auto px-4 py-16 md:py-24 relative z-10">
         <div className="text-center space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]">
               Live Events
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg leading-tight">
               Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Campaigns</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
               Discover the hottest betting campaigns, tournaments, and jackpot offers happening right now. Don't miss out on massive prize pools.
            </p>
         </div>

         {/* PROFESSIONAL CONTENT CARDS */}
         <div className="mt-16 space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            
            {/* Campaign 1 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl overflow-hidden shadow-xl hover:border-red-500/50 transition-all flex flex-col md:flex-row group">
               <div className="md:w-1/3 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center h-48 md:h-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d1422] to-transparent"></div>
               </div>
               <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                     <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-red-500/30 animate-pulse">Live Now</span>
                     <span className="text-gray-500 text-[10px] font-bold uppercase">Ends in 3 Days</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase mb-2">Champions League Predictor</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Predict the exact scores of this week's Champions League fixtures to win a share of the $50,000 jackpot.</p>
                  <Link href="/" className="bg-[#1c2638] text-white self-start px-6 py-2.5 rounded text-xs font-black uppercase tracking-wider border border-[#26344d] hover:bg-white hover:text-black transition">
                     Join Campaign
                  </Link>
               </div>
            </div>

            {/* Campaign 2 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl overflow-hidden shadow-xl hover:border-[#facc15]/50 transition-all flex flex-col md:flex-row group">
               <div className="md:w-1/3 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center h-48 md:h-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d1422] to-transparent"></div>
               </div>
               <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                     <span className="bg-[#facc15]/20 text-[#facc15] px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-[#facc15]/30">Upcoming</span>
                     <span className="text-gray-500 text-[10px] font-bold uppercase">Starts Friday</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase mb-2">Weekend Acca Boost</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Get a 50% boost on your potential winnings for any accumulator bet with 5+ legs placed this weekend.</p>
                  <Link href="/" className="bg-[#1c2638] text-white self-start px-6 py-2.5 rounded text-xs font-black uppercase tracking-wider border border-[#26344d] hover:bg-white hover:text-black transition">
                     Set Reminder
                  </Link>
               </div>
            </div>

         </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
