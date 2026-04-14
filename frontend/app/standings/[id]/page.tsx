"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LeagueStandings() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/standings/${id}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-white font-bold">Loading Live Table...</div>;

  // ULINZI MPYA: Kama Backend imetuma Error, onyesha ujumbe mzuri badala ya ku-crash
  if (data?.error) {
    return (
      <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center text-white">
        <span className="text-5xl mb-4">⚠️</span>
        <h2 className="text-xl font-bold text-red-500 mb-2">Oops! {data.error}</h2>
        <p className="text-gray-400 text-sm mb-6">Inawezekana API imegoma au msimu huu haujapatikana.</p>
        <Link href="/" className="bg-[#1e61d4] px-6 py-2 rounded font-bold hover:bg-[#2563eb] transition">← Rudi Nyumbani</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#facc15] mb-6 inline-block">← Back to Tips</Link>
        
        <div className="flex items-center gap-4 mb-8 bg-[#0d1422] p-6 rounded-xl border border-[#1c2638]">
          <img src={data?.logo} alt="" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-black text-white uppercase">{data?.league_name}</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{data?.country} - Live Standings</p>
          </div>
        </div>

        <div className="bg-[#0d1422] border border-[#1c2638] rounded-md overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm min-w-[600px]">
            <thead className="bg-[#162032] text-gray-500 uppercase font-black">
              <tr>
                <th className="p-3 w-10">#</th>
                <th className="p-3">Team</th>
                <th className="p-3 w-10 text-center">P</th>
                <th className="p-3 w-10 text-center text-green-500">W</th>
                <th className="p-3 w-10 text-center text-yellow-500">D</th>
                <th className="p-3 w-10 text-center text-red-500">L</th>
                <th className="p-3 w-10 text-center">GD</th>
                <th className="p-3 w-12 text-center text-white">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2638]">
              {/* ULINZI MPYA: Tumeongeza '?' baada ya standings kulinda map function */}
              {data?.standings?.map((team: any) => (
                <tr key={team.rank} className="hover:bg-[#111a2a] transition">
                  <td className="p-3 font-bold text-gray-400">{team.rank}</td>
                  <td className="p-3 flex items-center gap-3">
                    <img src={team.team.logo} className="w-6 h-6 object-contain" alt="" />
                    <span className="font-bold text-white">{team.team.name}</span>
                  </td>
                  <td className="p-3 text-center text-gray-400">{team.all.played}</td>
                  <td className="p-3 text-center">{team.all.win}</td>
                  <td className="p-3 text-center">{team.all.draw}</td>
                  <td className="p-3 text-center">{team.all.lose}</td>
                  <td className="p-3 text-center text-gray-400">{team.goalsDiff}</td>
                  <td className="p-3 text-center font-black text-[#facc15]">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}