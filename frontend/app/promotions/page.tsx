"use client";
import React from 'react';
import Link from 'next/link';

export default function PromotionsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#facc15]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#1e61d4]/10 rounded-full blur-[100px] pointer-events-none"></div>

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
      <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24 relative z-10">
         <div className="text-center space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <span className="inline-block bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(250,204,21,0.2)]">
               Exclusive Offers
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg leading-tight">
               Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-yellow-600">Promotions</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
               Unlock the best bonuses, free bets, and deposit matches from our top-tier betting partners. Maximize your starting capital today.
            </p>
         </div>

         {/* PROFESSIONAL CONTENT CARDS */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            {/* Promo 1 */}
            <div className="bg-[#0d1422] border border-[#1e61d4]/30 rounded-2xl overflow-hidden shadow-2xl hover:border-[#1e61d4] hover:shadow-[0_0_30px_rgba(30,97,212,0.2)] transition-all group flex flex-col">
               <div className="h-32 bg-gradient-to-br from-[#1e61d4] to-blue-900 p-6 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-20 text-8xl transform translate-x-4 translate-y-4 font-black">200%</div>
                  <span className="bg-white/20 text-white w-max px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest mb-2 backdrop-blur-sm">Top Rated</span>
                  <h3 className="text-white font-black text-2xl uppercase">MLBT Partner</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <p className="text-white font-black text-lg mb-2">200% Welcome Bonus</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">Register today using our exclusive promo code and double your first deposit instantly. Best odds guaranteed.</p>
                  <div className="bg-[#162032] border border-[#26344d] p-3 rounded-lg flex justify-between items-center mb-4">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Promo Code:</span>
                     <span className="text-sm font-black text-[#60a5fa]">SLYSPORTS</span>
                  </div>
                  <a href="https://mlbt.cc/4ATVYPe" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#1e61d4] hover:bg-blue-600 text-white py-3 rounded-lg font-black uppercase text-[11px] tracking-wider transition">
                     Claim Offer Now
                  </a>
               </div>
            </div>

            {/* Promo 2 */}
            <div className="bg-[#0d1422] border border-[#facc15]/30 rounded-2xl overflow-hidden shadow-2xl hover:border-[#facc15] hover:shadow-[0_0_30px_rgba(250,204,21,0.2)] transition-all group flex flex-col">
               <div className="h-32 bg-gradient-to-br from-[#facc15] to-yellow-700 p-6 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-20 text-8xl transform translate-x-4 translate-y-4 font-black text-black">130%</div>
                  <span className="bg-black/20 text-black w-max px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest mb-2 backdrop-blur-sm">Exclusive</span>
                  <h3 className="text-[#070b12] font-black text-2xl uppercase">LuckyPari</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <p className="text-white font-black text-lg mb-2">130% VIP Match</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">Get an enhanced VIP bonus on your deposit. Enjoy lightning-fast withdrawals and top-tier customer support.</p>
                  <div className="bg-[#162032] border border-[#26344d] p-3 rounded-lg flex justify-between items-center mb-4">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Promo Code:</span>
                     <span className="text-sm font-black text-[#facc15]">SLYSPORTS</span>
                  </div>
                  <a href="https://lckypr.com/Slysports" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#facc15] hover:bg-yellow-400 text-[#070b12] py-3 rounded-lg font-black uppercase text-[11px] tracking-wider transition">
                     Claim Offer Now
                  </a>
               </div>
            </div>

            {/* Promo 3 */}
            <div className="bg-[#0d1422] border border-green-500/30 rounded-2xl overflow-hidden shadow-2xl hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all group flex flex-col">
               <div className="h-32 bg-gradient-to-br from-green-500 to-green-800 p-6 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-20 text-8xl transform translate-x-4 translate-y-4 font-black">FREE</div>
                  <span className="bg-white/20 text-white w-max px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest mb-2 backdrop-blur-sm">Crypto Friendly</span>
                  <h3 className="text-white font-black text-2xl uppercase">888Starz</h3>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <p className="text-white font-black text-lg mb-2">Crypto Welcome Pack</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">Join the premier DeFi betting platform. Enjoy huge bonuses and daily rewards for active players.</p>
                  <div className="bg-[#162032] border border-[#26344d] p-3 rounded-lg flex justify-center items-center mb-4">
                     <span className="text-sm font-black text-green-500 uppercase">Auto-Applied via Link</span>
                  </div>
                  <a href="https://top100bonus.com/L?tag=d_5541916m_64133c_&site=5541916&ad=64133" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-black uppercase text-[11px] tracking-wider transition">
                     Claim Offer Now
                  </a>
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
