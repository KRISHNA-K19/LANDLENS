'use client';

import React from 'react';
import { ShieldAlert, CheckCircle, Info, PhoneCall, HelpCircle, Building2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Civic Help Center & Support Contact Strip */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">State Civic Support Helpline</h4>
              <p className="text-slate-400 text-xs">Toll-Free Revenue Grievance Helpline: <span className="font-mono text-emerald-400 font-bold">1800-425-1024</span> (24/7)</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Revenue Department Verification Portal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-400" /> {t('common.core_principle_title', 'Core Principle')}
            </h4>
            <p className="leading-relaxed">
              {t('common.core_principle_text', '"AI ASSISTS THE INVESTIGATION; THE AUTHORIZED OFFICER MAKES THE DECISION." LANDLENS does not make legal ownership decisions automatically.')}
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" /> {t('common.data_constraint_title', 'Data Source Constraint')}
            </h4>
            <p className="leading-relaxed">
              {t('common.data_constraint_text', 'Government land registries maintain final legal authority. LANDLENS operates as an intelligent civil verification layer.')}
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Architecture
            </h4>
            <p className="leading-relaxed">
              Built with Next.js, FastAPI, PostgreSQL/SQLite, Gemini AI Engine, Leaflet Maps, and Twilio SMS notification fallback.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>{t('common.copyright_text', '© 2026 LANDLENS - Citizen-Centric Land Record Verification & Grievance Resolution Platform')}</p>
          <div className="flex space-x-6 font-mono">
            <span>Primary Case Study: GL-1024</span>
            <span>Master Verification Code: 123456</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
