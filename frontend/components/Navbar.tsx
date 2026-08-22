'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Briefcase, Settings, FileText, MapPin, Eye, LogOut, KeyRound, HelpCircle, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const [activeRole, setActiveRole] = useState<'CITIZEN' | 'OFFICER' | 'ADMIN'>('CITIZEN');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    checkRoleAndAuth();
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/95 text-white shadow-xl border-b border-slate-800/80 transition-all duration-300">
      {/* Top Authoritative Notice Banner */}
      <div className="bg-slate-950 text-slate-300 text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 flex justify-between items-center border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="bg-emerald-600/90 text-white font-extrabold text-[9px] px-2 py-0.5 rounded tracking-wider shadow-2xs shrink-0">
            {t('common.civil_portal_banner', 'OFFICIAL GOVERNMENT CIVIC PORTAL')}
          </span>
          <span className="hidden lg:inline text-slate-400 font-medium truncate">
            {t('common.banner_legal_notice', 'Official Land Record Verification Layer. Final legal authority rests with jurisdiction revenue officers.')}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] shrink-0">
          <span className="text-slate-400 font-medium hidden xs:inline">{t('common.featured_case', 'Featured Case:')}</span>
          <Link href="/citizen/case/GL-1024" className="font-mono text-amber-400 font-bold hover:underline hover:text-amber-300 transition">
            GL-1024
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with LANDLENS -> நிலவறை Hover Effect */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group cursor-pointer shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative inline-flex items-center font-black text-lg sm:text-xl tracking-wider text-white min-w-[105px] sm:min-w-[125px]">
                <span className="transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95">
                  LANDLENS
                </span>
                <span className="absolute left-0 opacity-0 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 text-amber-400 font-bold whitespace-nowrap leading-none">
                  நிலவறை
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold bg-blue-500/20 text-blue-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-widest">
                TN-CIVIC
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium -mt-0.5 truncate max-w-[160px] sm:max-w-none">
              {t('common.portal_tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Dynamic Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
          {activeRole === 'CITIZEN' && (
            <>
              <Link
                href="/citizen/dashboard"
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/citizen/dashboard') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-400" /> {t('common.my_grievances', 'My Grievances')}
              </Link>
              <Link
                href="/citizen/locate"
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/citizen/locate') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4 text-blue-400" /> {t('common.locate_my_land', 'Locate My Land')}
              </Link>
              <Link
                href="/citizen/raise-grievance"
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all duration-200 transform hover:-translate-y-0.5 ml-1"
              >
                {t('common.raise_grievance', '+ Raise Grievance')}
              </Link>
            </>
          )}

          {activeRole === 'OFFICER' && (
            <>
              <Link
                href="/officer/dashboard"
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/officer/dashboard') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 text-blue-400" /> {t('common.case_queue', 'Case Queue')}
              </Link>
              <Link
                href="/officer/cases/1024"
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/officer/cases/1024') ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/admin/dashboard') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-blue-400" /> {t('common.console_overview', 'Console Overview')}
              </Link>
              <Link
                href="/admin/officers"
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/admin/officers') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t('common.revenue_officers', 'Revenue Officers')}
              </Link>
              <Link
                href="/admin/audit-logs"
                className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  pathname.includes('/admin/audit-logs') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" /> {t('common.audit_logs', 'Audit Logs')}
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Controls (Language + Sign In + Role Pills) */}
        <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
          <LanguageSelector />

          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800/80 text-red-200 font-bold border border-red-700/60 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" /> {t('common.sign_out', 'Sign Out')}
            </button>
          ) : (
            <Link
              href={activeRole === 'CITIZEN' ? '/citizen/login' : activeRole === 'OFFICER' ? '/officer/login' : '/admin/login'}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-900/30"
            >
              <KeyRound className="w-3.5 h-3.5" /> {t('common.sign_in', 'Sign In')}
            </Link>
          )}

          {/* Role Portal Selector */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-1 flex items-center space-x-1 shadow-inner">
            <button
              onClick={() => handleRoleSelect('CITIZEN')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all duration-200 ${
                activeRole === 'CITIZEN' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('common.role_citizen', 'Citizen')}
            </button>
            <button
              onClick={() => handleRoleSelect('OFFICER')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all duration-200 ${
                activeRole === 'OFFICER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('common.role_officer', 'Officer')}
            </button>
            <button
              onClick={() => handleRoleSelect('ADMIN')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all duration-200 ${
                activeRole === 'ADMIN' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('common.role_admin', 'Admin')}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Menu Button (visible on mobile/tablet screens < 1024px) */}
        <div className="flex lg:hidden items-center space-x-2">
          <LanguageSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer Menu (Android, iPhone, iPad Viewports) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4 animate-fade-in shadow-2xl">
          {/* Mobile Role Switcher Pills */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold pl-2 text-[11px]">Portal:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => handleRoleSelect('CITIZEN')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                  activeRole === 'CITIZEN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleSelect('OFFICER')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                  activeRole === 'OFFICER' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Officer
              </button>
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                  activeRole === 'ADMIN' ? 'bg-purple-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Navigation Links per active role */}
          <nav className="flex flex-col space-y-2 text-sm font-semibold">
            {activeRole === 'CITIZEN' && (
              <>
                <Link href="/citizen/dashboard" className="p-2.5 rounded-xl bg-slate-800/80 text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> {t('common.my_grievances', 'My Grievances')}
                </Link>
                <Link href="/citizen/locate" className="p-2.5 rounded-xl bg-slate-800/80 text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" /> {t('common.locate_my_land', 'Locate My Land')}
                </Link>
                <Link href="/citizen/raise-grievance" className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-2">
                  {t('common.raise_grievance', '+ Raise Grievance')}
                </Link>
              </>
            )}

            {activeRole === 'OFFICER' && (
              <>
                <Link href="/officer/dashboard" className="p-2.5 rounded-xl bg-slate-800/80 text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" /> {t('common.case_queue', 'Case Queue')}
                </Link>
                <Link href="/officer/cases/1024" className="p-2.5 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-200" /> {t('common.case_review', 'Case Workspace')} (GL-1024)
                </Link>
              </>
            )}

            {activeRole === 'ADMIN' && (
              <>
                <Link href="/admin/dashboard" className="p-2.5 rounded-xl bg-slate-800/80 text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-400" /> {t('common.console_overview', 'Console Overview')}
                </Link>
                <Link href="/admin/officers" className="p-2.5 rounded-xl bg-slate-800/80 text-white flex items-center gap-2">
                  {t('common.revenue_officers', 'Revenue Officers')}
                </Link>
                <Link href="/admin/audit-logs" className="p-2.5 rounded-xl bg-slate-800/80 text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> {t('common.audit_logs', 'Audit Logs')}
                </Link>
              </>
            )}
          </nav>

          {/* Auth Action in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 bg-red-900/60 text-red-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> {t('common.sign_out', 'Sign Out')}
              </button>
            ) : (
              <Link
                href={activeRole === 'CITIZEN' ? '/citizen/login' : activeRole === 'OFFICER' ? '/officer/login' : '/admin/login'}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <KeyRound className="w-4 h-4" /> {t('common.sign_in', 'Sign In')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
