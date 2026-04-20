"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const getSportIcon = (leagueName: string, defaultIcon?: string) => {
  if (defaultIcon) return defaultIcon;
  if (!leagueName) return "⚽";
  const name = leagueName.toLowerCase();
  if (name.includes("basket") || name.includes("nba")) return "🏀";
  if (name.includes("tennis") || name.includes("wta") || name.includes("atp")) return "🎾";
  return "⚽"; 
};

export default function MasterAdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ total_users: 0, active_slips: 0, ai_accuracy: "0%" });
  const [users, setUsers] = useState<any[]>([]);
  const [slips, setSlips] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States for Admin's internal builder & scanner
  const [dataYaLigi, setDataYaLigi] = useState<{top: any[], more: any[], results: any[]}>({top: [], more: [], results: []});
  const [betslip, setBetslip] = useState<any[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // New Slip State
  const [newSlip, setNewSlip] = useState({ title: "", code: "", odds: "", bookmaker: "1xBet", status: "Active" });

  const baseUrl = typeof window !== 'undefined' && window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "";

  useEffect(() => {
    // Basic Security Check (Hardcoded for testing based on your prompt)
    const userData = localStorage.getItem("slyUser");
    if (userData) {
      const user = JSON.parse(userData);
      // Admin bypass (Kwa sasa tunaruhusu, lakini in production if(user.email !== 'admin@slysports.co.tz') redirect)
    } else {
      window.location.href = "/login";
    }

    fetchAdminData();
    fetchMatchesData(); // Fetch matches for the admin's builder/results
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [resStats, resUsers, resSlips] = await Promise.all([
        fetch(`${baseUrl}/api/admin/stats`),
        fetch(`${baseUrl}/api/admin/users`),
        fetch(`${baseUrl}/api/admin/slips`)
      ]);
      
      if(resStats.ok) setStats(await resStats.json());
      if(resUsers.ok) setUsers(await resUsers.json());
      if(resSlips.ok) setSlips(await resSlips.json());
    } catch(err) {
      showToast("Error loading admin data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatchesData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/mikeka?t=${new Date().getTime()}`, { cache: "no-store" });
        if(res.ok) {
            const rawData = await res.json();
            if(rawData) setDataYaLigi({ top: rawData.top || [], more: rawData.more || [], results: rawData.results || [] });
        }
      } catch (err) { console.error(err); }
  };

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleCreateSlip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/admin/add_slip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlip)
      });
      if(res.ok) {
        showToast("✅ Slip Published Successfully!");
        setNewSlip({ title: "", code: "", odds: "", bookmaker: "1xBet", status: "Active" });
        fetchAdminData(); 
      } else {
        showToast("❌ Failed to add slip. Check Server.");
      }
    } catch(err) {
      showToast("❌ Failed to add slip.");
    }
  };

  const handleDeleteSlip = async (id: number) => {
    if(!window.confirm("Are you sure you want to delete this slip?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/admin/delete_slip/${id}`, { method: "DELETE" });
      if(res.ok) {
        showToast("🗑️ Slip Deleted.");
        fetchAdminData();
      }
    } catch(err) {
      showToast("❌ Delete Failed.");
    }
  };

  const handleScan = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!scanCode.trim()) return;
      setIsScanning(true);
      setScanResult(null);
      try {
          const res = await fetch(`${baseUrl}/api/scan-slip`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: scanCode })
          });
          if(res.ok) {
              const data = await res.json();
              setTimeout(() => { setScanResult(data); setIsScanning(false); }, 1500);
          }
      } catch(err) {
          setIsScanning(false); showToast("Error connecting to AI Server.");
      }
  };

  const toggleBetslip = (match: any, userPick: string, userOdd: string) => {
    const exists = betslip.find((m: any) => m.id === match.id);
    let newSlip = betslip.filter((m: any) => m.id !== match.id);
    if (exists && exists.userPick === userPick) {
      setBetslip(newSlip); showToast("❌ Removed from Slip");
    } else {
      newSlip.push({ ...match, userPick, userOdd });
      setBetslip(newSlip); showToast(`✅ Added: ${userPick} @ ${userOdd}`);
      if (!isSlipOpen) setIsSlipOpen(true);
    }
  };

  const calculateOdds = () => {
    let tOdds = 1; betslip.forEach(m => { tOdds *= parseFloat(m.userOdd); });
    return betslip.length === 0 ? "0.00" : tOdds.toFixed(2);
  };

  const fillWithAI = () => {
      const bookies = ["1xBet", "Betway", "SportyBet", "PariPesa", "Bet365"];
      setNewSlip({
          title: "🔥 AI GENERATED ACCA",
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          odds: (Math.random() * 20 + 5).toFixed(2),
          bookmaker: bookies[Math.floor(Math.random() * bookies.length)],
          status: "Active"
      });
      showToast("🤖 AI Filled Slip Details");
  };

  const handleLogout = () => {
    localStorage.removeItem("slyUser");
    window.location.href = "/login";
  };

  if (isLoading) return <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-white font-black animate-pulse">AUTHORIZING ADMIN...</div>;

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-200 font-sans flex flex-col md:flex-row selection:bg-[#facc15] selection:text-black relative">
      
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#facc15] text-[#070b12] px-6 py-3 rounded-md shadow-[0_10px_40px_rgba(250,204,21,0.5)] z-[100] font-black animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden bg-[#0d1422] border-b border-[#1c2638] p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center"><span className="text-white font-bold text-xl">M</span></div>
            <span className="text-lg font-black text-white tracking-wider">MASTER</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white text-2xl">
              {isMobileMenuOpen ? "✖" : "☰"}
          </button>
      </div>

      {/* --- ADMIN SIDEBAR --- */}
      <aside className={`${isMobileMenuOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-[#0d1422] border-r border-[#1c2638] flex-shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto shadow-xl z-40 fixed inset-0 md:relative`}>
        <div className="p-6 border-b border-[#1c2638] hidden md:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.5)]"><span className="text-white font-bold text-xl">M</span></div>
            <span className="text-xl font-black text-white tracking-wider">MASTER<span className="text-red-500">PANEL</span></span>
          </Link>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4 mb-2">System Controls</p>
          <button onClick={() => { setActiveTab("overview"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "overview" ? "bg-red-500/10 text-red-500 border-red-500" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
            <span>📊</span> Dashboard
          </button>
          <button onClick={() => { setActiveTab("slips"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "slips" ? "bg-red-500/10 text-red-500 border-red-500" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
            <span>🎟️</span> Manage VIP Slips
          </button>
          <button onClick={() => { setActiveTab("users"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "users" ? "bg-red-500/10 text-red-500 border-red-500" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
            <span>👥</span> Registered Users
          </button>

          <div className="pt-4 pb-2 border-b border-[#1c2638] mt-4">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4">Basic Features</p>
          </div>
          <button onClick={() => { setActiveTab("builder"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "builder" ? "bg-[#1e61d4]/10 text-[#5c98ff] border-[#1e61d4]" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
            <span>🔨</span> My Builder <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-black ${betslip.length > 0 ? "bg-[#facc15] text-[#070b12]" : "bg-gray-700 text-white"}`}>{betslip.length}</span>
          </button>
          <button onClick={() => { setActiveTab("scanner"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "scanner" ? "bg-purple-500/10 text-purple-400 border-purple-500" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
            <span>🤖</span> AI Scanner
          </button>
          <button onClick={() => { setActiveTab("results"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm transition border-l-4 ${activeTab === "results" ? "bg-green-500/10 text-green-500 border-green-500" : "text-gray-400 hover:bg-[#162032] border-transparent"}`}>
            <span>✅</span> Match Results
          </button>

          <div className="pt-4 pb-2 border-b border-[#1c2638] mt-4">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4">Navigation</p>
          </div>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm text-gray-400 hover:bg-[#162032] transition">
            <span>🏠</span> Landing Page
          </Link>
          <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm text-gray-400 hover:bg-[#162032] transition">
            <span>💻</span> Client Dashboard
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm text-red-500 hover:bg-red-500/10 transition mt-4 border border-red-500/20">
            <span>🚪</span> Secure Logout
          </button>
        </nav>
      </aside>

      {/* --- ADMIN MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 md:h-screen md:overflow-y-auto pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-[#0d1422] p-5 rounded-xl border border-[#1c2638] shadow-lg gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
              {activeTab === "overview" && "Command Center"}
              {activeTab === "slips" && "Slip Manager"}
              {activeTab === "users" && "User Database"}
              {activeTab === "builder" && "Admin Match Builder"}
              {activeTab === "scanner" && "AI Slip Validator"}
              {activeTab === "results" && "System Match Results"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Control everything on SlyTips from here.</p>
          </div>
          <div className="bg-red-600/20 text-red-500 border border-red-600/50 px-4 py-2 rounded-lg font-black uppercase text-xs animate-pulse">
            Root Access Granted
          </div>
        </header>

        {/* ======================================================== */}
        {/* TAB: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0d1422] p-6 rounded-xl border border-[#1c2638] shadow-lg border-t-4 border-t-[#1e61d4]">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Total Users</p>
                   <p className="text-4xl font-black text-white">{stats.total_users}</p>
                </div>
                <div className="bg-[#0d1422] p-6 rounded-xl border border-[#1c2638] shadow-lg border-t-4 border-t-[#facc15]">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Active VIP Slips</p>
                   <p className="text-4xl font-black text-white">{stats.active_slips}</p>
                </div>
                <div className="bg-[#0d1422] p-6 rounded-xl border border-[#1c2638] shadow-lg border-t-4 border-t-green-500">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">AI Engine Accuracy</p>
                   <p className="text-4xl font-black text-green-500">{stats.ai_accuracy}</p>
                </div>
             </div>
             
             <div className="bg-gradient-to-r from-[#1c2638] to-[#0d1422] rounded-xl p-8 border border-[#26344d] text-center mt-10">
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Welcome, Boss.</h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">Use the sidebar to add new VIP slips that will reflect instantly on all clients' dashboards, or monitor your growing user base.</p>
             </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: SLIP MANAGER */}
        {/* ======================================================== */}
        {activeTab === "slips" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 shadow-2xl sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-black uppercase tracking-widest text-sm border-b border-[#1c2638] pb-2 w-full">📝 Publish VIP Slip</h3>
                        </div>

                        <form onSubmit={handleCreateSlip} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Slip Title</label>
                                <input type="text" required placeholder="e.g. MEGA WEEKEND ACCA" value={newSlip.title} onChange={e => setNewSlip({...newSlip, title: e.target.value})} className="w-full bg-[#162032] border border-[#26344d] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Total Odds</label>
                                    <input type="text" required placeholder="15.40" value={newSlip.odds} onChange={e => setNewSlip({...newSlip, odds: e.target.value})} className="w-full bg-[#162032] border border-[#26344d] text-[#facc15] font-black text-lg rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Bookmaker</label>
                                    <select value={newSlip.bookmaker} onChange={e => setNewSlip({...newSlip, bookmaker: e.target.value})} className="w-full bg-[#162032] border border-[#26344d] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500">
                                        <option value="1xBet">1xBet</option>
                                        <option value="Betway">Betway</option>
                                        <option value="SportyBet">SportyBet</option>
                                        <option value="Bet365">Bet365</option>
                                        <option value="PariPesa">PariPesa</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Booking Code</label>
                                <input type="text" required placeholder="8BD7A" value={newSlip.code} onChange={e => setNewSlip({...newSlip, code: e.target.value.toUpperCase()})} className="w-full bg-[#162032] border border-[#26344d] text-white font-black tracking-widest text-center text-lg rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 uppercase" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                                <select value={newSlip.status} onChange={e => setNewSlip({...newSlip, status: e.target.value})} className="w-full bg-[#162032] border border-[#26344d] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500">
                                    <option value="Active">🟢 Active (Live)</option>
                                    <option value="Won">✅ Won</option>
                                    <option value="Lost">❌ Lost</option>
                                </select>
                            </div>
                            
                            <div className="pt-4 flex gap-2">
                                <button type="button" onClick={fillWithAI} className="bg-purple-600/20 text-purple-400 border border-purple-500/50 p-3 rounded-lg hover:bg-purple-600/40 transition" title="Auto-Fill with AI">🤖</button>
                                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-lg text-sm uppercase tracking-widest transition shadow-lg shadow-red-500/20">
                                    Broadcast Slip
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 shadow-2xl">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">Published Slips History</h2>
                    {slips.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-[#26344d] rounded-xl"><p className="text-gray-500 font-bold">No slips published yet.</p></div>
                    ) : (
                        <div className="space-y-4">
                            {slips.map((slip, i) => (
                                <div key={i} className="bg-[#162032] border border-[#26344d] p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-gray-500 transition">
                                    <div className="w-full md:w-auto text-center md:text-left">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{slip.bookmaker}</p>
                                        <h4 className="text-white font-black text-sm uppercase">{slip.title}</h4>
                                        <p className="text-[#facc15] font-black text-sm mt-1">{slip.odds} Odds</p>
                                    </div>
                                    <div className="bg-[#070b12] border border-[#1c2638] px-4 py-2 rounded text-white font-black tracking-widest text-lg text-center w-full md:w-auto">
                                        {slip.code}
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <span className={`text-xs font-black px-2 py-1 rounded ${slip.status === 'Active' ? 'bg-blue-500/10 text-blue-500' : slip.status === 'Won' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {slip.status}
                                        </span>
                                        <button onClick={() => handleDeleteSlip(slip.id)} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: REGISTERED USERS */}
        {/* ======================================================== */}
        {activeTab === "users" && (
            <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">Registered Users Database</h2>
                    <span className="bg-[#1e61d4]/10 text-[#5c98ff] font-bold px-3 py-1 rounded-full text-xs border border-[#1e61d4]/30">{users.length} Total</span>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[#090d16] text-gray-500 text-[10px] uppercase tracking-widest border-b border-[#1c2638]">
                                <th className="p-4 rounded-tl-lg">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Phone/Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-gray-300">
                            {users.map((u, i) => (
                                <tr key={i} className="border-b border-[#1c2638]/50 hover:bg-[#162032] transition">
                                    <td className="p-4 text-gray-600">#{u.id}</td>
                                    <td className="p-4 text-white">{u.name || "N/A"}</td>
                                    <td className="p-4 tracking-widest">{u.phone}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] px-2 py-1 rounded uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-[#1e61d4]/10 text-[#5c98ff]'}`}>
                                            {u.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{u.joined}</td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No users found in database.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MY BUILDER (ADMIN VERSION) */}
        {/* ======================================================== */}
        {activeTab === "builder" && (
            <section className="max-w-4xl mx-auto pb-10">
                <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 md:p-8 shadow-2xl mb-8">
                    <div className="flex justify-between items-center mb-8 border-b border-[#1c2638] pb-4">
                        <div><h2 className="text-2xl font-black text-white uppercase tracking-wider">Admin Custom Slip</h2><p className="text-sm text-gray-400 mt-1">Build slips to broadcast to clients.</p></div>
                        {betslip.length > 0 && <button onClick={() => {setBetslip([]); showToast("Slip Cleared!");}} className="text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded text-[10px] font-black uppercase">Clear All</button>}
                    </div>

                    {betslip.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-[#26344d] rounded-xl bg-[#090d16]">
                            <p className="text-5xl mb-4">🎟️</p>
                            <p className="text-gray-400 font-bold text-lg">Your slip is empty.</p>
                            <p className="text-gray-500 text-sm mt-2 mb-6">Select matches below to build a slip.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-8">
                                {betslip.map((m: any, i: number) => (
                                    <div key={i} className="bg-[#162032] p-4 md:p-5 rounded-xl border border-[#26344d] flex justify-between items-center hover:border-[#5c98ff]/50 transition">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{m.leagueName}</p>
                                            <p className="text-sm md:text-base font-black text-white mb-2">{m.home} <span className="text-gray-500 font-normal mx-1">vs</span> {m.away}</p>
                                            <div className="flex gap-2 items-center">
                                              <span className="bg-[#1e61d4] text-white text-[10px] font-black px-3 py-1 rounded shadow-md">Pick: {m.userPick}</span>
                                              <span className="text-[#facc15] font-black text-sm">@{m.userOdd}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => toggleBetslip(m, m.userPick, m.userOdd)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition" title="Remove">✖</button>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-[#090d16] p-4 rounded-xl border border-[#1c2638] flex justify-between items-center">
                                <span className="text-gray-400 font-bold uppercase text-xs">Total Odds:</span>
                                <span className="text-xl font-black text-[#facc15]">{calculateOdds()}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-[#0d1422] border border-[#1c2638] rounded-md shadow-lg overflow-hidden pb-4">
                  <div className="bg-[#090d16] p-4 border-b border-[#1c2638]">
                     <h2 className="font-black text-white text-sm uppercase tracking-wider">Available Matches</h2>
                  </div>
                  <div className="flex flex-col">
                    {dataYaLigi.top.map((ligi: any, index: number) => (
                      <LeagueSection key={`b-top-${index}`} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
                    ))}
                  </div>
                </div>
            </section>
        )}

        {/* ======================================================== */}
        {/* TAB 5: AI SCANNER */}
        {/* ======================================================== */}
        {activeTab === "scanner" && (
            <section className="max-w-2xl mx-auto">
                <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30"><span className="text-3xl">🤖</span></div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">AI Slip Validator</h2>
                        <p className="text-sm text-gray-400 mt-2">Test AI analysis on booking codes.</p>
                    </div>
                    <form onSubmit={handleScan} className="mb-8">
                        <div className="flex flex-col md:flex-row gap-3">
                            <input type="text" value={scanCode} onChange={(e) => setScanCode(e.target.value.toUpperCase())} placeholder="Enter Booking Code" className="flex-1 bg-[#070b12] border border-[#26344d] text-white text-center md:text-left text-lg font-black tracking-widest rounded-lg px-4 py-4 focus:outline-none focus:border-purple-500 transition" required />
                            <button type="submit" disabled={isScanning} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-8 py-4 rounded-lg uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                {isScanning ? <span className="animate-pulse">Scanning...</span> : "Analyze Slip"}
                            </button>
                        </div>
                    </form>
                    {scanResult && (
                        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl animate-fade-in">
                            <div className="flex justify-between items-start mb-4 border-b border-gray-600/30 pb-4">
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Code Scanned</p><p className="text-xl font-black text-white">{scanResult.scanned_code}</p></div>
                                <div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Win Probability</p><p className="text-3xl font-black text-green-500">{scanResult.win_probability}</p></div>
                            </div>
                            <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">AI Expert Analysis</p><p className="text-sm text-gray-200 leading-relaxed font-medium">{scanResult.analysis}</p></div>
                        </div>
                    )}
                </div>
            </section>
        )}

        {/* ======================================================== */}
        {/* TAB 6: MATCH RESULTS */}
        {/* ======================================================== */}
        {activeTab === "results" && (
            <section className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-green-500/20 to-transparent border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                    <h3 className="text-green-500 font-black uppercase text-sm">System Results & AI Settlement</h3>
                </div>
                <div className="bg-[#0d1422] rounded-xl border border-[#1c2638] overflow-hidden shadow-xl">
                    {dataYaLigi.results.length > 0 ? dataYaLigi.results.map((res: any, idx: number) => (
                        <div key={idx} className="p-4 border-b border-[#1c2638] last:border-0 hover:bg-[#162032] transition flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1 w-full text-center md:text-left">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{res.leagueName}</p>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <span className="font-black text-white text-base">{res.home}</span>
                                    <span className="bg-[#070b12] border border-[#26344d] text-[#facc15] font-black px-3 py-1 rounded shadow-inner text-lg">{res.score}</span>
                                    <span className="font-black text-white text-base">{res.away}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Status: {res.status}</p>
                            </div>
                            <div className="w-full md:w-auto bg-[#090d16] border border-[#1c2638] p-3 rounded-lg flex flex-col items-center min-w-[150px]">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">AI Pick</p>
                                <p className="font-black text-white uppercase text-sm mb-2">{res.ai_tip}</p>
                                {res.result_status === "WON" ? (
                                    <span className="bg-green-500/10 text-green-500 border border-green-500/30 px-3 py-1 rounded text-xs font-black w-full text-center">✅ WON</span>
                                ) : res.result_status === "LOST" ? (
                                    <span className="bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-black w-full text-center">❌ LOST</span>
                                ) : (
                                    <span className="bg-gray-500/10 text-gray-400 border border-gray-500/30 px-3 py-1 rounded text-xs font-black w-full text-center">⏳ PEND</span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center"><p className="text-gray-500 font-bold">No finished matches available yet.</p></div>
                    )}
                </div>
            </section>
        )}

      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0d1422; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1c2638; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1e61d4; }
      `}</style>
    </div>
  );
}

// =================================================================
// COMPONENT YA JEDWALI (MECHI 10 TU + SHOW MORE)
// =================================================================
function LeagueSection({ ligi, betslip, toggleBetslip }: { ligi: any, betslip: any[], toggleBetslip: any }) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 10;
  const hasMore = ligi.matches?.length > INITIAL_COUNT;
  const visibleMatches = expanded ? ligi.matches : ligi.matches?.slice(0, INITIAL_COUNT);

  return (
    <div className="border-b border-[#1c2638] last:border-0 bg-[#0d1422]">
      <div className="flex items-center gap-3 bg-[#111a2a] px-4 py-3 border-b border-[#1c2638]">
        <span className="text-[16px]">{getSportIcon(ligi.name, ligi.icon)}</span>
        <h2 className="font-black text-xs uppercase tracking-widest text-[#5c98ff]">{ligi.name}</h2>
      </div>
      
      <div className="flex flex-col">
        {visibleMatches?.map((mkeka: any) => (
           <MatchRow key={mkeka.id} mkeka={mkeka} ligi={ligi} betslip={betslip} toggleBetslip={toggleBetslip} />
        ))}
      </div>
      {hasMore && !expanded && (
        <div onClick={() => setExpanded(true)} className="text-center py-4 bg-[#162032] text-[#5c98ff] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-[#1e61d4] hover:text-white transition border-t border-[#1c2638]">
          ▼ Show {ligi.matches.length - INITIAL_COUNT} More Matches
        </div>
      )}
    </div>
  );
}

function MatchRow({ mkeka, ligi, betslip, toggleBetslip }: { mkeka: any, ligi: any, betslip: any[], toggleBetslip: any }) {
  const seed = parseInt(String(mkeka.id).replace(/\D/g, '')) || 123;
  const deterministicRandom = (offset: number) => { const x = Math.sin(seed + offset) * 10000; return x - Math.floor(x); };

  const aiTarget = mkeka.ai_tip ? mkeka.ai_tip.toUpperCase() : "1";
  const rawOdds = mkeka.odds || {};
  let goalMarket = "2.5";
  if (aiTarget.includes("1.5")) goalMarket = "1.5";
  if (aiTarget.includes("3.5")) goalMarket = "3.5";

  const isSoccer = !ligi.name.toLowerCase().includes("basket") && !ligi.name.toLowerCase().includes("tennis");

  const standardOptions = isSoccer ? [
      { group: "1X2", options: [{ label: "1", odd: rawOdds['1'] || (deterministicRandom(1) * 2 + 1.5).toFixed(2) }, { label: "X", odd: rawOdds['X'] || (deterministicRandom(2) * 1.5 + 2.8).toFixed(2) }, { label: "2", odd: rawOdds['2'] || (deterministicRandom(3) * 2 + 2.5).toFixed(2) }]},
      { group: "DC", options: [{ label: "1X", odd: (deterministicRandom(4) * 0.5 + 1.1).toFixed(2) }, { label: "12", odd: (deterministicRandom(5) * 0.3 + 1.2).toFixed(2) }, { label: "X2", odd: (deterministicRandom(6) * 0.8 + 1.3).toFixed(2) }]}
  ] : [
      { group: "WINNER", options: [{ label: "1", odd: rawOdds['1'] || (deterministicRandom(1) * 1.5 + 1.3).toFixed(2) }, { label: "2", odd: rawOdds['2'] || (deterministicRandom(2) * 1.5 + 1.5).toFixed(2) }]}
  ];

  return (
    <div className="px-4 py-4 border-b border-[#1c2638]/50 hover:bg-[#162032] transition duration-200">
      <div className="flex justify-between items-center mb-3">
         <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#facc15] font-bold bg-yellow-500/10 px-2 py-0.5 rounded text-center">{mkeka.status}</span>
            <div className="font-bold text-sm text-gray-200">{mkeka.home} <span className="text-gray-500 font-normal px-1">vs</span> {mkeka.away}</div>
         </div>
      </div>
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
         {standardOptions.map(group => (
            <div key={group.group} className="flex flex-col bg-[#090d16] p-1.5 rounded border border-[#1c2638] min-w-[120px] md:min-w-0 md:flex-1">
               <span className="text-[8px] text-gray-500 font-bold uppercase text-center mb-1">{group.group}</span>
               <div className="flex gap-1">
                  {group.options.map(opt => {
                     const inSlip = betslip.find((m: any) => m.id === mkeka.id && m.userPick === opt.label);
                     return (
                        <button 
                          key={opt.label}
                          onClick={() => toggleBetslip({...mkeka, leagueName: ligi.name}, opt.label, opt.odd)}
                          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded transition relative overflow-hidden ${inSlip ? "bg-[#1e61d4] border border-[#5c98ff]" : "bg-[#070b12] border border-[#26344d] hover:bg-[#1c2638]"}`}
                        >
                          <span className={`text-[9px] font-black ${inSlip ? "text-white" : "text-gray-400"}`}>{opt.label}</span>
                          <span className={`text-[10px] font-bold ${inSlip ? "text-white" : "text-gray-300"}`}>{opt.odd}</span>
                        </button>
                     )
                  })}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}