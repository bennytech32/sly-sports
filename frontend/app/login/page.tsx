"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // SMART URL: Inatambua kama upo Localhost inaenda Port 8000, ukiwa Vercel inasoma kawaida
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";
      
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      if (res.ok) {
        const data = await res.json();
        // Hifadhi taarifa za mtumiaji kwenye simu/browser
        localStorage.setItem("slyUser", JSON.stringify(data.user));
        // Mpeleke Dashboard moja kwa moja
        window.location.href = "/"; 
      } else {
        const data = await res.json();
        setError(data.detail || "Namba au Password imekosewa.");
      }
    } catch (err) {
      setError("Imeshindwa kuunganisha na Server. Tafadhali jaribu tena.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4">
      <div className="bg-[#0d1422] border border-[#1c2638] rounded-2xl shadow-2xl p-8 max-w-md w-full">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
             <div className="w-12 h-12 bg-[#1e61d4] rounded flex items-center justify-center shadow-[0_0_15px_rgba(30,97,212,0.5)] mx-auto">
                <span className="text-white font-bold text-3xl">S</span>
             </div>
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Welcome Back</h1>
          <p className="text-sm text-gray-400 mt-2">Login to access your VIP dashboard.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center mb-6 font-bold">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">📱</span>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#162032] border border-[#26344d] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#1e61d4] transition" placeholder="0712345678" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">🔒</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#162032] border border-[#26344d] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#1e61d4] transition" placeholder="••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white font-black py-4 rounded-lg uppercase tracking-widest text-sm hover:scale-[1.02] transition shadow-[0_5px_15px_rgba(30,97,212,0.4)] disabled:opacity-50">
            {isLoading ? "Authenticating..." : "Login Securely"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <Link href="/register" className="text-[#facc15] font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}