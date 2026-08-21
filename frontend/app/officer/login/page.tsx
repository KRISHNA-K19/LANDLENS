'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Building2, Lock, ArrowRight, UserCheck } from 'lucide-react';

export default function OfficerLoginPage() {
  const router = useRouter();
  const [employeeCode, setEmployeeCode] = useState<string>('REV-AMB-01');
  const [password, setPassword] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('landlens_role', 'OFFICER');
      router.push('/officer/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            Revenue Department Workspace
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Officer Workspace</h1>
          <p className="text-xs text-slate-600">
            Review cases. Verify evidence. Resolve grievances.
          </p>
        </div>

        <form onSubmit={handleOfficerLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Official Email / Employee ID</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="e.g. REV-AMB-01"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Revenue Tahsildar: <span className="font-mono font-bold text-emerald-800">REV-AMB-01</span>
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 block">Department Password / MFA</label>
              <button type="button" className="text-[11px] text-emerald-700 hover:underline font-medium">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
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
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {loading ? 'Authenticating Officer Credentials...' : 'Sign In to Workspace'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <div className="flex justify-center gap-4 text-xs font-semibold">
            <Link href="/citizen/login" className="text-blue-600 hover:underline">Citizen Portal →</Link>
            <Link href="/admin/login" className="text-purple-700 hover:underline">Admin Console →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
