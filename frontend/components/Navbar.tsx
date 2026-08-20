'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Briefcase, Settings, FileText, MapPin, Eye, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  // Active Role state stored in localStorage (default CITIZEN)
  const [activeRole, setActiveRole] = useState<'CITIZEN' | 'OFFICER' | 'ADMIN'>('CITIZEN');

  useEffect(() => {
    const savedRole = localStorage.getItem('landlens_role');
    if (savedRole === 'OFFICER' || savedRole === 'ADMIN' || savedRole === 'CITIZEN') {
      setActiveRole(savedRole);
    }
  }, []);

  const handleRoleChange = (newRole: 'CITIZEN' | 'OFFICER' | 'ADMIN') => {
    setActiveRole(newRole);
    localStorage.setItem('landlens_role', newRole);
    if (newRole === 'CITIZEN') router.push('/citizen/dashboard');
    else if (newRole === 'OFFICER') router.push('/officer/dashboard');
    else if (newRole === 'ADMIN') router.push('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top Authoritative Notice Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded tracking-wider">
            {t('civil_portal_banner')}
          </span>
          <span className="hidden sm:inline">
            {t('banner_legal_notice')}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="text-slate-400">{t('featured_case')}</span>
          <Link href="/citizen/case/GL-1024" className="font-mono text-amber-400 font-bold hover:underline">
            GL-1024 (Survey 142/3B vs 142/3C)
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-500 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-white">LANDLENS</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                TN-CIVIC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5">{t('portal_tagline')}</p>
          </div>
        </Link>

        {/* Dynamic Role Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 text-sm">
          {activeRole === 'CITIZEN' && (
            <>
              <Link
                href="/citizen/dashboard"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/citizen/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" /> {t('my_grievances')}
              </Link>
              <Link
                href="/citizen/locate"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/citizen/locate') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-4 h-4" /> {t('locate_my_land')}
              </Link>
              <Link
                href="/citizen/raise-grievance"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium shadow-sm flex items-center gap-1.5 transition ml-2"
              >
                {t('raise_grievance')}
              </Link>
            </>
          )}

          {activeRole === 'OFFICER' && (
            <>
              <Link
                href="/officer/dashboard"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/officer/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-4 h-4" /> {t('case_queue')}
              </Link>
              <Link
                href="/officer/case/GL-1024"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/officer/case/GL-1024') ? 'bg-amber-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-300" /> {t('case_review')} (GL-1024)
              </Link>
            </>
          )}

          {activeRole === 'ADMIN' && (
            <>
              <Link
                href="/admin/dashboard"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/admin/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" /> {t('admin_overview')}
              </Link>
              <Link
                href="/admin/audit-logs"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/admin/audit-logs') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> {t('audit_logs')}
              </Link>
            </>
          )}
        </nav>

        {/* Language Selector + Role Switcher Pill + Sign In Link */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Tri-Lingual Selector */}
          <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
            </select>
          </div>

          <Link
            href="/login"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold border border-slate-700 rounded-lg text-xs transition flex items-center gap-1"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" /> {t('sign_in')}
          </Link>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handleRoleChange('CITIZEN')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                activeRole === 'CITIZEN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('role_citizen')}
            </button>
            <button
              onClick={() => handleRoleChange('OFFICER')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                activeRole === 'OFFICER' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('role_officer')}
            </button>
            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                activeRole === 'ADMIN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('role_admin')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
