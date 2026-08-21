'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, KeyRound, ArrowRight, Activity } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState<string>('ADMIN-01');
  const [password, setPassword] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('landlens_role', 'ADMIN');
      router.push('/admin/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <span className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
            System Administration
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Administration Console</h1>
          <p className="text-xs text-slate-600">
            Monitor platform operations, routing, compliance and system activity.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Email / ID</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. ADMIN-01"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Master Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {loading ? 'Authenticating Admin Console...' : 'Sign In to Console'} <Activity className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <div className="flex justify-center gap-4 text-xs font-semibold">
            <Link href="/citizen/login" className="text-blue-600 hover:underline">Citizen Portal →</Link>
            <Link href="/officer/login" className="text-emerald-700 hover:underline">Officer Portal →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
