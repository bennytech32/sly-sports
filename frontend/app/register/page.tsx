"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // SMART URL: Inatambua kama upo Localhost inaenda Port 8000, ukiwa Vercel inasoma kawaida
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";
      
      const res = await fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login"; // Inakupeleka Login ukifanikiwa
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.detail || "Imeshindwa kusajili, namba hii huenda ipo tayari.");
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
             <div className="w-12 h-12 bg-[#facc15] rounded flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)] mx-auto">
                <span className="text-[#070b12] font-bold text-3xl">S</span>
             </div>
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Create Account</h1>
          <p className="text-sm text-gray-400 mt-2">Join thousands of winners today. It's free!</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center mb-6 font-bold">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded text-center mb-6 font-bold">✅ Usajili umekamilika! Tunakupeleka Login...</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">👤</span>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#162032] border border-[#26344d] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#1e61d4] transition" placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">📱</span>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#162032] border border-[#26344d] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#facc15] transition" placeholder="0712345678" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">🔒</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#162032] border border-[#26344d] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#1e61d4] transition" placeholder="••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#facc15] to-yellow-600 text-[#070b12] font-black py-4 rounded-lg uppercase tracking-widest text-sm hover:scale-[1.02] transition shadow-[0_5px_15px_rgba(250,204,21,0.3)] disabled:opacity-50">
            {isLoading ? "Creating..." : "Create VIP Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link href="/login" className="text-[#5c98ff] font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}