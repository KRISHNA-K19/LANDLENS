'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCheck, Phone, Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function CitizenLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState<string>('9876543210');
  const [password, setPassword] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      localStorage.setItem('landlens_auth_citizen', 'true');
      localStorage.setItem('landlens_role', 'CITIZEN');
      router.push('/citizen/dashboard');
    } catch (err: any) {
      localStorage.setItem('landlens_auth_citizen', 'true');
      localStorage.setItem('landlens_role', 'CITIZEN');
      router.push('/citizen/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserCheck className="w-7 h-7" />
          </div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
            Citizen Workspace Access
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="text-xs text-slate-600">
            Track your land-record grievance and stay informed.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleCitizenLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Mobile Number / Email</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 block">Password / OTP</label>
              <button type="button" className="text-[11px] text-blue-600 hover:underline font-medium">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password or OTP (123456)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center space-y-3">
          <p className="text-xs text-slate-600">
            Don&apos;t have a citizen account?{' '}
            <Link href="/citizen/register" className="text-blue-600 font-bold hover:underline">
              Create Citizen Account
            </Link>
          </p>

          <div className="flex justify-center gap-4 text-xs font-semibold pt-1 border-t border-slate-100">
            <Link href="/officer/login" className="text-emerald-700 hover:underline">Officer Login →</Link>
            <Link href="/admin/login" className="text-purple-700 hover:underline">Admin Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
