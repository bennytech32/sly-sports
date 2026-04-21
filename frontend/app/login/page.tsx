"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const t = {
    en: {
      welcome: "Welcome Back",
      subtitle: "Login to access your Premium AI Predictions and VIP Slips.",
      phoneOrEmail: "Phone Number or Email",
      password: "Password",
      loginBtn: "Access Dashboard",
      loading: "Authenticating...",
      noAccount: "Don't have an account?",
      register: "Create Free Account",
      backHome: "Back to Home",
      successAdmin: "Master Admin Authorized! Redirecting...",
      successUser: "Login Successful! Redirecting..."
    },
    sw: {
      welcome: "Karibu Tena",
      subtitle: "Ingia kupata Utabiri wa AI na Mikeka yako ya VIP.",
      phoneOrEmail: "Namba ya Simu au Email",
      password: "Neno la Siri (Password)",
      loginBtn: "Ingia Kwenye Dashibodi",
      loading: "Inathibitisha...",
      noAccount: "Hauna akaunti?",
      register: "Tengeneza Akaunti Bure",
      backHome: "Rudi Mwanzo",
      successAdmin: "Admin Amethibitishwa! Inakupeleka...",
      successUser: "Umeingia Kikamilifu! Inakupeleka..."
    }
  }[lang];

  useEffect(() => {
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin' || user.phone === 'admin@slysports.co.tz') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } catch (e) {
        localStorage.removeItem("slyUser");
      }
    }
  }, []);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ========================================================
    // MASTER ADMIN BYPASS (Njia ya mkato ya Admin)
    // ========================================================
    if (formData.phone === "admin@slysports.co.tz" && formData.password === "mikekatz") {
        setTimeout(() => {
            const adminData = { id: 0, name: "Master Admin", phone: "admin@slysports.co.tz", role: "admin" };
            localStorage.setItem("slyUser", JSON.stringify(adminData));
            showToast(t.successAdmin);
            setTimeout(() => { window.location.href = "/admin"; }, 1000);
        }, 1000);
        return;
    }

    // ========================================================
    // NORMAL USER LOGIN (Via API) - Imefanyiwa Polishing kwa Vercel
    // ========================================================
    try {
        // Tunatumia Relative Path Moja kwa Moja inafanya vizuri sana Vercel
        const res = await fetch(`/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === "success") {
                localStorage.setItem("slyUser", JSON.stringify(data.user));
                showToast(t.successUser);
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/dashboard";
                    }
                }, 1000);
            } else {
                showToast(data.detail || "Invalid credentials. Please try again.");
                setIsLoading(false);
            }
        } else {
            // Kama Server itatupa 400 au 500 error
            let errorDetail = "Invalid credentials or Server Error.";
            try {
                const errorData = await res.json();
                if(errorData.detail) errorDetail = errorData.detail;
            } catch(e) {} // Catch in case Vercel returns HTML error page
            showToast(`❌ Error: ${errorDetail}`);
            setIsLoading(false);
        }
    } catch (error: any) {
        console.error("Login Fetch Error:", error);
        showToast(`🔌 Network Error: Please check your connection.`);
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#1e61d4]/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#1e61d4] text-white px-6 py-3 rounded-md shadow-[0_10px_40px_rgba(30,97,212,0.6)] z-[100] font-black animate-bounce flex items-center gap-2">
          {toastMsg.includes("Admin") ? "👑" : toastMsg.includes("Success") ? "✅" : toastMsg.includes("Error") ? "❌" : "⚠️"} {toastMsg}
        </div>
      )}

      <header className="p-6 md:p-8 flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                <span className="text-[#070b12] font-black text-2xl">S</span>
            </div>
            <span className="text-2xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">TIPS</span></span>
        </Link>
        <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="bg-[#1c2638] text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-[#26344d] transition border border-[#26344d]">
                {lang === 'en' ? '🇹🇿 SW' : '🇬🇧 EN'}
            </button>
            <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm hidden sm:block transition">
                {t.backHome}
            </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-[#0d1422]/80 backdrop-blur-md border border-[#1c2638] p-8 md:p-10 rounded-2xl shadow-2xl">
              <div className="text-center mb-8">
                  <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">{t.welcome}</h1>
                  <p className="text-gray-400 text-sm">{t.subtitle}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{t.phoneOrEmail}</label>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                          <input 
                              type="text" required
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-[#1e61d4] focus:ring-1 focus:ring-[#1e61d4] transition"
                              placeholder="e.g. 0712345678 or admin@slysports.co.tz"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{t.password}</label>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                          <input 
                              type="password" required
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-[#1e61d4] focus:ring-1 focus:ring-[#1e61d4] transition"
                              placeholder="••••••••"
                          />
                      </div>
                  </div>

                  <button 
                      type="submit" disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white font-black py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition transform disabled:opacity-50 mt-4"
                  >
                      {isLoading ? t.loading : t.loginBtn}
                  </button>
              </form>

              <div className="mt-8 text-center border-t border-[#1c2638] pt-6">
                  <p className="text-gray-400 text-sm">
                      {t.noAccount} <Link href="/register" className="text-[#facc15] font-black hover:underline ml-1">{t.register}</Link>
                  </p>
              </div>
          </div>
      </div>
    </main>
  );
}