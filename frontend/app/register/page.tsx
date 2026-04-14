"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({ name: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // FIX YA VERCEL: Tumetoa localhost, sasa inasoma moja kwa moja /api/register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Akaunti imetengenezwa kikamilifu! Tafadhali ingiza namba na password yako kuingia.");
        router.push("/login");
      } else {
        setError(data.detail || "Usajili umeshindikana. Namba inaweza kuwa tayari inatumika.");
      }
    } catch (err) {
      setError("Imeshindwa kuunganisha na Server. Tafadhali jaribu tena.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans flex flex-col selection:bg-[#facc15] selection:text-black">
      <header className="bg-[#0d1422] border-b border-[#1c2638] py-4 px-6 text-center shadow-md">
        <Link href="/" className="inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition transform">
          <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            <span className="text-[#070b12] font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">TIPS</span></span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-[#0d1422] border border-[#1c2638] rounded-xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center mb-8 relative z-10">
            <span className="text-4xl mb-3 block">💎</span>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Create Account</h1>
            <p className="text-gray-400 text-sm font-medium">Join thousands of winners today. It's free!</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs text-center p-3 rounded-md font-bold animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">👤</span>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" className="w-full bg-[#162032] border border-[#26344d] rounded-md px-4 py-3 pl-10 text-white focus:outline-none focus:border-[#facc15] transition" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">📱</span>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="e.g. 0700 000 000" className="w-full bg-[#162032] border border-[#26344d] rounded-md px-4 py-3 pl-10 text-white focus:outline-none focus:border-[#facc15] transition" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">🔒</span>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Create a strong password" className="w-full bg-[#162032] border border-[#26344d] rounded-md px-4 py-3 pl-10 text-white focus:outline-none focus:border-[#facc15] transition" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#facc15] to-yellow-600 text-[#070b12] font-black text-sm uppercase tracking-wider py-3.5 rounded-md mt-6 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition active:scale-95 flex justify-center items-center gap-2">
              {isLoading ? <span className="w-5 h-5 border-2 border-[#070b12] border-t-transparent rounded-full animate-spin"></span> : "Create VIP Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 relative z-10">
            Already have an account? <Link href="/login" className="text-[#5c98ff] font-bold hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}