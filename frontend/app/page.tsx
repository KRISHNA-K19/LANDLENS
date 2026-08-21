'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, UserCheck, Briefcase, Settings, ArrowRight, CheckCircle2,
  ShieldAlert, Sparkles, FileText, Search, Cpu, Clock, Lock, FileSearch, ArrowDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-20 py-4">
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> {t('landing.hero_badge', 'AI-assisted. Human-verified.')}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              LANDLENS
            </h1>
            <p className="text-2xl md:text-3xl text-blue-200 font-extrabold">
              {t('landing.hero_title', 'Transparent Land Record Verification & Discrepancy Resolution')}
            </p>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
              {t('landing.hero_subtitle', 'Locate land parcels, compare reference registries against title evidence with AI assistance, and track grievance resolution with jurisdiction revenue officers.')}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/citizen/locate"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition group"
              >
                {t('landing.btn_locate_land', 'Locate My Land & Jurisdiction')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              
              <Link
                href="/citizen/raise-grievance"
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl flex items-center gap-2 transition"
              >
                {t('landing.btn_raise_grievance', 'Raise a Grievance')} <ArrowDown className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Statement */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('common.banner_legal_notice')}</span>
            </div>
          </div>

          {/* Clean Product Visualization / Dashboard Preview */}
          <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-700 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[11px]">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-blue-400" /> {t('landing.case_study_title', 'Primary Verification Case Study (GL-1024)')}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                UNDER REVIEW
              </span>
            </div>

            <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">FIELD COMPARISON ENGINE</div>
              <div className="flex justify-between text-slate-300">
                <span>Survey Ref:</span>
                <span className="text-emerald-400 font-bold">142/3B</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Submitted Deed:</span>
                <span className="text-amber-400 font-bold">142/3C</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[11px]">
                <span className="text-slate-400">AI Finding:</span>
                <span className="text-amber-400 font-bold">POTENTIAL DISCREPANCY</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Jurisdiction: Ambattur Tahsildar</span>
              <span className="text-blue-400">SLA: 18h Remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW LANDLENS WORKS */}
      <section id="how-it-works" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {t('landing.how_it_works', 'How LANDLENS Works')}
          </h2>
          <p className="text-slate-600 text-sm">
            A transparent 5-step workflow linking citizens, AI assistance, and authorized officers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('landing.step1_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing.step1_desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('landing.step2_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing.step2_desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('landing.step3_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing.step3_desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('landing.step4_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing.step4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — DEDICATED WORKSPACES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {t('landing.choose_portal_title', 'Choose Your Dedicated Portal')}
          </h2>
          <p className="text-slate-600 text-sm">
            Select your role to access customized dashboards, workflows, and permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">{t('common.role_citizen')}</h3>
              <p className="text-xs text-slate-600">{t('access.citizen_desc')}</p>
            </div>
            <Link href="/citizen/login" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
              {t('common.role_citizen')} {t('common.sign_in')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">{t('common.role_officer')}</h3>
              <p className="text-xs text-slate-600">{t('access.officer_desc')}</p>
            </div>
            <Link href="/officer/login" className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
              {t('common.role_officer')} {t('common.sign_in')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">{t('common.role_admin')}</h3>
              <p className="text-xs text-slate-600">{t('access.admin_desc')}</p>
            </div>
            <Link href="/admin/login" className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
              {t('common.role_admin')} {t('common.sign_in')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 pt-8 space-y-6 text-xs text-slate-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-extrabold text-slate-900 text-base block">LANDLENS</span>
            <p className="text-slate-500 text-xs">{t('common.portal_tagline')}</p>
          </div>

          <div className="flex flex-wrap gap-6 font-medium">
            <a href="#how-it-works" className="hover:text-slate-900">{t('landing.how_it_works')}</a>
            <Link href="/access" className="hover:text-slate-900">{t('access.title')}</Link>
            <Link href="/citizen/login" className="hover:text-slate-900">{t('common.role_citizen')} {t('common.sign_in')}</Link>
            <Link href="/officer/login" className="hover:text-slate-900">{t('common.role_officer')} {t('common.sign_in')}</Link>
            <Link href="/admin/login" className="hover:text-slate-900">{t('common.role_admin')} {t('common.sign_in')}</Link>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4 text-center text-slate-400">
          © 2026 LANDLENS - {t('common.portal_tagline')}
        </div>
      </footer>
    </div>
  );
}
