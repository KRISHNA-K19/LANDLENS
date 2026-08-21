'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, ShieldCheck, Settings, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AccessPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" /> {t('access.badge', 'LANDLENS Role Access')}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{t('access.title', 'Choose your workspace')}</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          {t('access.subtitle', 'Select your designated role to enter your specialized workspace with role-specific tools, permissions, and workflows.')}
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Citizen Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition space-y-5 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Public Access
              </span>
              <h3 className="font-extrabold text-slate-900 text-xl mt-1">{t('common.role_citizen', 'CITIZEN')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('access.citizen_desc')}
            </p>
          </div>
          <Link
            href="/citizen/login"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {t('common.role_citizen')} {t('common.sign_in')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Officer Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition space-y-5 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Revenue Authority
              </span>
              <h3 className="font-extrabold text-slate-900 text-xl mt-1">{t('common.role_officer', 'OFFICER')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('access.officer_desc')}
            </p>
          </div>
          <Link
            href="/officer/login"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {t('common.role_officer')} {t('common.sign_in')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Admin Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition space-y-5 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                System Administration
              </span>
              <h3 className="font-extrabold text-slate-900 text-xl mt-1">{t('common.role_admin', 'ADMIN')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('access.admin_desc')}
            </p>
          </div>
          <Link
            href="/admin/login"
            className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {t('common.role_admin')} {t('common.sign_in')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
