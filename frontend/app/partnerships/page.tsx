"use client";
import React from 'react';
import Link from 'next/link';

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 rounded-full blur-[150px] pointer-events-none"></div>

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
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
               Let's Grow Together
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg leading-tight">
               Open to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Partnerships</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
               Collaborate with SlySports to drive engagement, acquire high-value players, and boost your brand visibility in the sports betting ecosystem.
            </p>
         </div>

         {/* CONTENT GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            
            {/* Box 1 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-8 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
               <h3 className="text-2xl font-black text-white uppercase mb-4">Affiliate Programs</h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-6">We drive highly targeted, converting traffic to your sportsbook or casino. Let's discuss CPA, RevShare, or hybrid deals.</p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-emerald-500">✓</span> High Conversion Rates</li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-emerald-500">✓</span> Quality Player Retention</li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-emerald-500">✓</span> Transparent Reporting</li>
               </ul>
            </div>

            {/* Box 2 */}
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl p-8 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
               <h3 className="text-2xl font-black text-white uppercase mb-4">Sponsored Content</h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-6">Feature your brand directly to our engaged community through tailored campaigns, banner placements, and exclusive promo codes.</p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-teal-500">✓</span> Premium Banner Placements</li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-teal-500">✓</span> Social Media Mentions</li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-teal-500">✓</span> Custom Articles & Reviews</li>
               </ul>
            </div>
         </div>

         <div className="bg-gradient-to-r from-[#1c2638] to-[#0d1422] border border-[#26344d] rounded-2xl p-8 md:p-12 mt-12 text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
            <h2 className="text-3xl font-black text-white uppercase mb-4">Ready to Partner?</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-xl mx-auto">Contact our business development team today to explore how we can create a mutually beneficial partnership.</p>
            <Link href="mailto:business@slysports.com" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-[#070b12] px-8 py-3.5 rounded-lg font-black uppercase tracking-wider text-sm shadow-xl transition-all">
               Email Us Now
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
