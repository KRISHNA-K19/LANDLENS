'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Briefcase, Settings, FileText, MapPin, Eye, LogOut, KeyRound } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  // Active Role state stored in localStorage (default CITIZEN)
  const [activeRole, setActiveRole] = useState<'CITIZEN' | 'OFFICER' | 'ADMIN'>('CITIZEN');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    checkRoleAndAuth();
  }, [pathname]);

  const checkRoleAndAuth = () => {
    let currentRole: 'CITIZEN' | 'OFFICER' | 'ADMIN' = 'CITIZEN';

    if (pathname.startsWith('/officer')) {
      currentRole = 'OFFICER';
    } else if (pathname.startsWith('/admin')) {
      currentRole = 'ADMIN';
    } else if (pathname.startsWith('/citizen')) {
      currentRole = 'CITIZEN';
    } else {
      const saved = localStorage.getItem('landlens_role') as any;
      if (saved === 'OFFICER' || saved === 'ADMIN' || saved === 'CITIZEN') {
        currentRole = saved;
      }
    }

    setActiveRole(currentRole);

    const isAuth = localStorage.getItem(`landlens_auth_${currentRole.toLowerCase()}`) === 'true';
    setIsAuthenticated(isAuth);

    // Enforce authentication on protected dashboard routes
    const isProtectedDashboard =
      (pathname.startsWith('/citizen/') && !pathname.includes('/citizen/login') && !pathname.includes('/citizen/register')) ||
      (pathname.startsWith('/officer/') && !pathname.includes('/officer/login')) ||
      (pathname.startsWith('/admin/') && !pathname.includes('/admin/login'));

    if (isProtectedDashboard && !isAuth) {
      if (currentRole === 'CITIZEN') router.push('/citizen/login');
      else if (currentRole === 'OFFICER') router.push('/officer/login');
      else if (currentRole === 'ADMIN') router.push('/admin/login');
    }
  };

  const handleRoleSelect = (newRole: 'CITIZEN' | 'OFFICER' | 'ADMIN') => {
    setActiveRole(newRole);
    localStorage.setItem('landlens_role', newRole);

    const isAuthForRole = localStorage.getItem(`landlens_auth_${newRole.toLowerCase()}`) === 'true';

    if (isAuthForRole) {
      if (newRole === 'CITIZEN') router.push('/citizen/dashboard');
      else if (newRole === 'OFFICER') router.push('/officer/dashboard');
      else if (newRole === 'ADMIN') router.push('/admin/dashboard');
    } else {
      // Require login through dedicated portal
      if (newRole === 'CITIZEN') router.push('/citizen/login');
      else if (newRole === 'OFFICER') router.push('/officer/login');
      else if (newRole === 'ADMIN') router.push('/admin/login');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(`landlens_auth_${activeRole.toLowerCase()}`);
    setIsAuthenticated(false);
    if (activeRole === 'CITIZEN') router.push('/citizen/login');
    else if (activeRole === 'OFFICER') router.push('/officer/login');
    else if (activeRole === 'ADMIN') router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top Authoritative Notice Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded tracking-wider">
            {t('common.civil_portal_banner', 'CIVIL VERIFICATION PORTAL')}
          </span>
          <span className="hidden sm:inline">
            {t('common.banner_legal_notice', 'Official Land Record Verification Layer. Final legal authority rests with jurisdiction officers.')}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="text-slate-400">{t('common.featured_case', 'Featured Case:')}</span>
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
            <p className="text-[11px] text-slate-400 -mt-0.5">{t('common.portal_tagline')}</p>
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
                <FileText className="w-4 h-4" /> {t('common.my_grievances', 'My Grievances')}
              </Link>
              <Link
                href="/citizen/locate"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/citizen/locate') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-4 h-4" /> {t('common.locate_my_land', 'Locate My Land')}
              </Link>
              <Link
                href="/citizen/raise-grievance"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium shadow-sm flex items-center gap-1.5 transition ml-2"
              >
                {t('common.raise_grievance', '+ Raise Grievance')}
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
                <Briefcase className="w-4 h-4" /> {t('common.case_queue', 'Case Queue')}
              </Link>
              <Link
                href="/officer/cases/1024"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/officer/cases/1024') ? 'bg-amber-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-300" /> {t('common.case_review', 'Case Workspace')} (GL-1024)
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
                <Settings className="w-4 h-4" /> {t('common.console_overview', 'Console Overview')}
              </Link>
              <Link
                href="/admin/officers"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/admin/officers') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {t('common.revenue_officers', 'Revenue Officers')}
              </Link>
              <Link
                href="/admin/audit-logs"
                className={`px-3 py-2 rounded-md font-medium flex items-center gap-1.5 transition ${
                  pathname.includes('/admin/audit-logs') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> {t('common.audit_logs', 'Audit Logs')}
              </Link>
            </>
          )}
        </nav>

        {/* Language Selector + Authentication Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <LanguageSelector />

          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="px-2.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 font-bold border border-red-700/60 rounded-lg text-xs transition flex items-center gap-1"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" /> {t('common.sign_out', 'Sign Out')}
            </button>
          ) : (
            <Link
              href={activeRole === 'CITIZEN' ? '/citizen/login' : activeRole === 'OFFICER' ? '/officer/login' : '/admin/login'}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" /> {t('common.sign_in', 'Sign In')}
            </Link>
          )}

          {/* Role Portal Selector */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 flex items-center space-x-1">
            <button
              onClick={() => handleRoleSelect('CITIZEN')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                activeRole === 'CITIZEN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('common.role_citizen', 'Citizen')}
            </button>
            <button
              onClick={() => handleRoleSelect('OFFICER')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                activeRole === 'OFFICER' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('common.role_officer', 'Officer')}
            </button>
            <button
              onClick={() => handleRoleSelect('ADMIN')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                activeRole === 'ADMIN' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('common.role_admin', 'Admin')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
