"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Results() {
  const [dataYaLigi, setDataYaLigi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/results");
        if (res.ok) {
          setDataYaLigi(await res.json());
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 p-4">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-10 bg-[#0d1422] p-4 rounded-xl border border-[#1c2638]">
        <Link href="/" className="font-black text-xl text-white">SLY<span className="text-[#facc15]">RESULTS</span></Link>
        <Link href="/" className="bg-[#162032] px-4 py-2 rounded text-xs font-bold border border-[#26344d]">← Home</Link>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
           <h1 className="text-2xl font-black text-white uppercase tracking-wider">Yesterday's Performance</h1>
           <p className="text-gray-400 text-xs">Verify our Sly AI Engine accuracy on past matches.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading Results...</div>
        ) : dataYaLigi.map((ligi) => (
          <div key={ligi.id} className="bg-[#0d1422] border border-[#1c2638] rounded-md overflow-hidden">
            <div className="bg-[#162032] px-4 py-2 flex items-center gap-3 border-b border-[#1c2638]">
              <img src={ligi.logo} className="w-4 h-4 object-contain" alt="" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{ligi.name}</span>
            </div>
            <div className="divide-y divide-[#1c2638]/50">
              {ligi.matches.map((match: any) => (
                <div key={match.id} className="p-4 flex items-center justify-between hover:bg-[#111a2a] transition">
                  <div className="flex-1 text-right pr-4">
                    <p className="text-sm font-bold text-white">{match.home}</p>
                  </div>
                  <div className="bg-[#070b12] px-3 py-1 rounded border border-[#26344d] text-center min-w-[70px]">
                    <span className="text-lg font-black text-[#facc15]">{match.hg} - {match.ag}</span>
                  </div>
                  <div className="flex-1 text-left pl-4">
                    <p className="text-sm font-bold text-white">{match.away}</p>
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-1 ml-6 border-l border-[#1c2638] pl-6">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">AI Tip: {match.tip}</span>
                    {match.won ? (
                      <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded">✅ WON</span>
                    ) : (
                      <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded">❌ LOST</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}