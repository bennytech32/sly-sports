"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  
  const [users, setUsers] = useState<any[]>([]);
  const [slips, setSlips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, users, createSlip

  // Form State ya Mkeka
  const [slipData, setSlipData] = useState({ title: "", odds: "", code: "", bookmaker: "1xBet" });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchSlips();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchSlips = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/slips");
    const data = await res.json();
    setSlips(data.slips || []);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (pin === "2026") { // PIN YA ADMIN
      setIsAuthenticated(true);
    } else {
      alert("PIN si sahihi! Wewe si Admin.");
    }
  };

  const handleGenerateAI = () => {
    // AI Inatengeneza mkeka wa uongo kwa haraka kurahisisha kazi ya Admin
    setSlipData({
      title: "Sly AI Mega Acca 🔥",
      odds: (Math.random() * (50 - 10) + 10).toFixed(2), // Random odds 10 to 50
      code: "SLY" + Math.floor(Math.random() * 90000 + 10000) + "X",
      bookmaker: "1xBet"
    });
  };

  const handlePublishSlip = async (e: any) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/admin/slips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slipData)
    });
    if (res.ok) {
      alert("Mkeka umewekwa hewani kikamilifu!");
      setSlipData({ title: "", odds: "", code: "", bookmaker: "1xBet" });
      fetchSlips();
      setActiveTab("dashboard");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#0d1422] p-8 rounded-xl border border-red-500/30 text-center max-w-sm w-full">
          <span className="text-4xl block mb-4">👑</span>
          <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Master Admin</h1>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter Admin PIN" className="w-full bg-[#162032] border border-[#26344d] rounded p-3 text-center text-white tracking-widest text-xl mb-4 focus:outline-none focus:border-red-500" />
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700">Access Panel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-200 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR YA ADMIN */}
      <aside className="w-full md:w-64 bg-[#0d1422] border-r border-[#1c2638] flex-shrink-0 md:h-screen md:sticky top-0 p-4">
        <div className="mb-8 mt-2 text-center">
          <h2 className="text-xl font-black text-white tracking-widest">SLY <span className="text-red-500">ADMIN</span></h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Master Control Panel</p>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-3 rounded font-bold text-sm transition ${activeTab === "dashboard" ? "bg-red-600 text-white" : "text-gray-400 hover:bg-[#162032]"}`}>📊 Dashboard</button>
          <button onClick={() => setActiveTab("users")} className={`w-full text-left px-4 py-3 rounded font-bold text-sm transition ${activeTab === "users" ? "bg-red-600 text-white" : "text-gray-400 hover:bg-[#162032]"}`}>👥 Registered Users</button>
          <button onClick={() => setActiveTab("createSlip")} className={`w-full text-left px-4 py-3 rounded font-bold text-sm transition ${activeTab === "createSlip" ? "bg-red-600 text-white" : "text-gray-400 hover:bg-[#162032]"}`}>🎟️ Create VIP Slip</button>
        </nav>
        <div className="mt-10">
          <Link href="/" className="block text-center w-full border border-[#26344d] text-gray-400 hover:text-white py-2 rounded text-xs font-bold transition">← Back to Website</Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10">
        
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-black text-white uppercase mb-6">System Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#0d1422] border border-[#1c2638] p-6 rounded-xl shadow-lg">
                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2">Total Users</p>
                <p className="text-5xl font-black text-[#facc15]">{users.length}</p>
              </div>
              <div className="bg-[#0d1422] border border-[#1c2638] p-6 rounded-xl shadow-lg">
                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2">Published Slips</p>
                <p className="text-5xl font-black text-[#1e61d4]">{slips.length}</p>
              </div>
              <div className="bg-[#0d1422] border border-[#1c2638] p-6 rounded-xl shadow-lg">
                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2">System Status</p>
                <p className="text-xl font-black text-green-500 flex items-center gap-2 mt-3"><span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> ONLINE</p>
              </div>
            </div>

            <h2 className="text-lg font-black text-white uppercase mb-4 border-l-4 border-red-500 pl-3">Recently Published Slips</h2>
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-md overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#162032] text-gray-500 uppercase font-black text-xs">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Odds</th>
                    <th className="p-4">Code</th>
                    <th className="p-4">Bookmaker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2638]">
                  {slips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-[#111a2a]">
                      <td className="p-4 font-bold text-white">{slip.title}</td>
                      <td className="p-4 font-black text-[#facc15]">{slip.odds}</td>
                      <td className="p-4"><span className="bg-[#162032] px-2 py-1 rounded text-xs border border-[#26344d]">{slip.code}</span></td>
                      <td className="p-4 text-gray-400 font-bold">{slip.bookmaker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {slips.length === 0 && <p className="p-8 text-center text-gray-500">No slips published yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h1 className="text-2xl font-black text-white uppercase mb-6 border-l-4 border-blue-500 pl-3">Registered Customers</h1>
            <div className="bg-[#0d1422] border border-[#1c2638] rounded-md overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#162032] text-gray-500 uppercase font-black text-xs">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Phone Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2638]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#111a2a]">
                      <td className="p-4 text-gray-500 font-bold">#{user.id}</td>
                      <td className="p-4 font-bold text-white uppercase">{user.name}</td>
                      <td className="p-4 font-black text-[#5c98ff]">{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="p-8 text-center text-gray-500">No users registered yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "createSlip" && (
          <div className="max-w-xl">
            <h1 className="text-2xl font-black text-white uppercase mb-2 border-l-4 border-green-500 pl-3">Create VIP Slip</h1>
            <p className="text-gray-400 text-sm mb-6">Publish a new booking code for your users. It will appear on their dashboard.</p>
            
            <div className="bg-[#0d1422] border border-[#1c2638] p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
              
              <button type="button" onClick={handleGenerateAI} className="w-full mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase text-xs tracking-widest py-3 rounded shadow-lg hover:scale-[1.02] transition flex justify-center items-center gap-2">
                <span>🤖</span> Auto-Generate with Sly AI Pro
              </button>

              <div className="flex items-center gap-4 mb-6">
                <hr className="flex-1 border-[#26344d]" />
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">OR ENTER MANUALLY</span>
                <hr className="flex-1 border-[#26344d]" />
              </div>

              <form onSubmit={handlePublishSlip} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Slip Title</label>
                  <input type="text" required value={slipData.title} onChange={e => setSlipData({...slipData, title: e.target.value})} placeholder="e.g. Mega Weekend Acca" className="w-full bg-[#162032] border border-[#26344d] rounded px-3 py-2.5 text-white focus:outline-none focus:border-green-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Odds</label>
                    <input type="text" required value={slipData.odds} onChange={e => setSlipData({...slipData, odds: e.target.value})} placeholder="e.g. 24.50" className="w-full bg-[#162032] border border-[#26344d] rounded px-3 py-2.5 text-white focus:outline-none focus:border-green-500 font-black text-[#facc15]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Code</label>
                    <input type="text" required value={slipData.code} onChange={e => setSlipData({...slipData, code: e.target.value})} placeholder="e.g. SLY89K" className="w-full bg-[#162032] border border-[#26344d] rounded px-3 py-2.5 text-white focus:outline-none focus:border-green-500 font-black uppercase" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bookmaker (Kampuni)</label>
                  <select value={slipData.bookmaker} onChange={e => setSlipData({...slipData, bookmaker: e.target.value})} className="w-full bg-[#162032] border border-[#26344d] rounded px-3 py-2.5 text-white focus:outline-none focus:border-green-500">
                    <option value="1xBet">1xBet</option>
                    <option value="Betway">Betway</option>
                    <option value="SportPesa">SportPesa</option>
                    <option value="Betpawa">Betpawa</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-black uppercase tracking-wider py-3.5 rounded mt-4 hover:bg-green-700 transition shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  Publish VIP Slip Now
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}