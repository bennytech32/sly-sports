"use client";
import React from 'react';
import Link from 'next/link';

export default function BuildingBrandsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#6366f1]/10 rounded-full blur-[150px] pointer-events-none"></div>

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
            <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.2)]">
               Industry Leaders
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg leading-tight">
               Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">Gaming Brands</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
               We help sports betting and casino operators establish a dominant presence in the market through strategic marketing and user engagement.
            </p>
         </div>

         {/* PROFESSIONAL CONTENT CARDS */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            
            {/* Card 1 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-8 shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all group relative overflow-hidden flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  📈
               </div>
               <h3 className="text-white font-black text-xl uppercase mb-3">Audience Growth</h3>
               <p className="text-gray-400 text-sm leading-relaxed">Leverage our massive network to acquire high-value players and rapidly expand your active user base.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-8 shadow-xl hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all group relative overflow-hidden flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  🎯
               </div>
               <h3 className="text-white font-black text-xl uppercase mb-3">Brand Strategy</h3>
               <p className="text-gray-400 text-sm leading-relaxed">Develop a compelling brand identity that resonates with modern bettors and stands out in a crowded market.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-8 shadow-xl hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all group relative overflow-hidden flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  🔄
               </div>
               <h3 className="text-white font-black text-xl uppercase mb-3">Player Retention</h3>
               <p className="text-gray-400 text-sm leading-relaxed">Implement data-driven engagement campaigns that keep players coming back and increase lifetime value.</p>
            </div>

         </div>

         <div className="text-center mt-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
            <Link href="/contact" className="inline-block bg-white text-black px-8 py-4 rounded-lg font-black uppercase tracking-wider text-sm shadow-xl hover:bg-gray-200 transition-all hover:-translate-y-1">
               Consult With Our Experts
            </Link>
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
