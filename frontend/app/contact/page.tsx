"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const t = {
    en: {
      title: "Get in Touch",
      subtitle: "Have a question about our VIP Slips or AI Predictions? We're here to help.",
      addressTitle: "Our Location",
      phoneTitle: "Call or WhatsApp",
      emailTitle: "Email Us",
      formTitle: "Send us a Message",
      nameLabel: "Your Name",
      emailLabel: "Email Address",
      messageLabel: "Your Message",
      sendBtn: "Send Message",
      sending: "Sending...",
      successMsg: "Message sent successfully! We'll get back to you soon.",
      backHome: "Back to Home",
    },
    sw: {
      title: "Wasiliana Nasi",
      subtitle: "Una swali kuhusu Mikeka ya VIP au Utabiri wa AI? Tuko hapa kukusaidia.",
      addressTitle: "Ofisi Zetu",
      phoneTitle: "Piga au WhatsApp",
      emailTitle: "Barua Pepe (Email)",
      formTitle: "Tutume Ujumbe",
      nameLabel: "Jina Lako",
      emailLabel: "Barua Pepe Yako",
      messageLabel: "Ujumbe Wako",
      sendBtn: "Tuma Ujumbe",
      sending: "Inatuma...",
      successMsg: "Ujumbe umetumwa kikamilifu! Tutawasiliana nawe hivi punde.",
      backHome: "Rudi Mwanzo",
    }
  }[lang];

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      showToast(t.successMsg);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] selection:text-black flex flex-col relative overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#1e61d4]/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#facc15]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-[#1e61d4] text-white px-6 py-3 rounded-md shadow-[0_10px_40px_rgba(30,97,212,0.6)] z-[100] font-black animate-bounce flex items-center gap-2">
          <span>✅</span> {toastMsg}
        </div>
      )}

      {/* HEADER */}
      <header className="p-6 md:p-8 flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                <span className="text-[#070b12] font-black text-2xl">S</span>
            </div>
            <span className="text-2xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">SPORTS</span></span>
        </Link>
        <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="bg-[#1c2638] text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-[#26344d] transition border border-[#26344d]">
                {lang === 'en' ? '🇹🇿 SW' : '🇬🇧 EN'}
            </button>
            <Link href="/" className="text-gray-400 hover:text-white font-bold text-sm hidden sm:flex items-center gap-2 transition">
                <span>🏠</span> {t.backHome}
            </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 relative z-10">
        
        {/* Page Titles */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            24/7 Support
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* CONTACT INFO CARDS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Card */}
            <div className="bg-[#0d1422] border border-[#1c2638] p-8 rounded-2xl shadow-xl flex items-start gap-4 group hover:border-[#1e61d4]/50 transition">
              <div className="w-12 h-12 bg-[#1e61d4]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform">
                📍
              </div>
              <div>
                <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">{t.addressTitle}</h3>
                <p className="text-white font-black text-lg">Dar es salaam - Tanzania</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-[#0d1422] border border-[#1c2638] p-8 rounded-2xl shadow-xl flex items-start gap-4 group hover:border-[#25D366]/50 transition">
              <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform">
                📞
              </div>
              <div>
                <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">{t.phoneTitle}</h3>
                <p className="text-white font-black text-lg">+255 783 871 961</p>
                <p className="text-white font-black text-lg mt-1">+255 678 157 500</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-[#0d1422] border border-[#1c2638] p-8 rounded-2xl shadow-xl flex items-start gap-4 group hover:border-[#facc15]/50 transition">
              <div className="w-12 h-12 bg-[#facc15]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform">
                ✉️
              </div>
              <div>
                <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">{t.emailTitle}</h3>
                <a href="mailto:info@slysports.co.tz" className="text-white font-black text-lg hover:text-[#facc15] transition">
                  info@slysports.co.tz
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 flex gap-4">
              <a href="https://whatsapp.com/channel/0029VbCbNM23gvWVS8NV8g3F" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-[#25D366] hover:text-white transition font-black text-sm uppercase">
                <span className="text-lg">💬</span> WhatsApp
              </a>
              <a href="https://www.instagram.com/sly_sports_tips?igsh=ajNycHpobnNqNGl2" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#E1306C]/10 border border-[#E1306C]/30 text-[#E1306C] py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-[#E1306C] hover:text-white transition font-black text-sm uppercase">
                <span className="text-lg">📸</span> Instagram
              </a>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-[#0d1422] border border-[#1c2638] p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e61d4]/10 rounded-full blur-[50px] pointer-events-none"></div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8 border-l-4 border-[#1e61d4] pl-4">
                {t.formTitle}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{t.nameLabel}</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-xl px-5 py-4 focus:outline-none focus:border-[#1e61d4] transition"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{t.emailLabel}</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-xl px-5 py-4 focus:outline-none focus:border-[#1e61d4] transition"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{t.messageLabel}</label>
                  <textarea 
                    required rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-xl px-5 py-4 focus:outline-none focus:border-[#1e61d4] transition resize-none custom-scrollbar"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full md:w-auto px-10 bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition transform disabled:opacity-50"
                >
                  {isSubmitting ? t.sending : t.sendBtn}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE BOTTOM NAV - RETURN TO HOME */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-[#0d1422] border-t border-[#1c2638] p-4 z-50">
         <Link href="/" className="flex items-center justify-center gap-2 bg-[#1c2638] text-white py-3 rounded-lg font-black uppercase text-xs">
            <span>🏠</span> {t.backHome}
         </Link>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0d1422; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #26344d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1e61d4; }
      `}</style>
    </main>
  );
}