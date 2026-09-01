"use client";
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const showToast = (message: string) => {
        setToastMsg(message);
        setTimeout(() => setToastMsg(""), 4000);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            return showToast("❌ Error: Invalid or missing Reset Token.");
        }
        if (formData.password !== formData.confirmPassword) {
            return showToast("⚠️ Error: Passwords do not match.");
        }

        setIsLoading(true);

        try {
            // Hapa inatuma token na password mpya kwenda Backend
            const res = await fetch('/api/reset-password/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, new_password: formData.password })
            });

            if (res.ok) {
                setIsSuccess(true);
                showToast("✅ Password Reset Successful!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                const data = await res.json();
                showToast(`❌ Error: ${data.detail || "Failed to reset password."}`);
                setIsLoading(false);
            }
        } catch (error) {
            showToast(`🔌 Network Error: Please try again.`);
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-black text-red-500 mb-2">Invalid Link ❌</h2>
                <p className="text-gray-400 mb-6">This reset link is invalid or has expired.</p>
                <Link href="/login" className="bg-[#1c2638] text-white px-6 py-3 rounded-lg font-bold">Back to Login</Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center p-10 animate-fade-in">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase mb-2">Password Updated!</h2>
                <p className="text-gray-400 mb-6">Your password has been changed successfully. Redirecting to login...</p>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#1e61d4]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1e61d4]/30">
                    <span className="text-2xl">🔑</span>
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Create New Password</h1>
                <p className="text-gray-400 text-sm">Enter your new secure password below.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
                <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">New Password</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                        <input
                            type="password" required minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-[#1e61d4] focus:ring-1 focus:ring-[#1e61d4] transition"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Confirm Password</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                        <input
                            type="password" required minLength={6}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-[#162032] border border-[#26344d] text-white font-bold rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-[#1e61d4] focus:ring-1 focus:ring-[#1e61d4] transition"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#1e61d4] to-[#2563eb] text-white font-black py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition transform disabled:opacity-50 mt-4"
                >
                    {isLoading ? "Saving..." : "Save New Password"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-[#070b12] text-gray-200 font-sans selection:bg-[#facc15] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#1e61d4]/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="p-6 md:p-8 flex justify-center items-center relative z-10 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                        <span className="text-[#070b12] font-black text-2xl">S</span>
                    </div>
                    <span className="text-2xl font-black text-white tracking-wider">SLY<span className="text-[#facc15]">TIPS</span></span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md bg-[#0d1422]/80 backdrop-blur-md border border-[#1c2638] p-8 md:p-10 rounded-2xl shadow-2xl">
                    {/* Suspense inahitajika kwa Next.js inapotumia useSearchParams */}
                    <Suspense fallback={<div className="text-center text-gray-500 font-bold">Loading secure portal...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}