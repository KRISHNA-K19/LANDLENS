'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Briefcase, Settings, ArrowRight, Cpu, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Citizen-Centric Verification Layer
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            LANDLENS
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-medium">
            Citizen-Centric Land Record Verification & Grievance Resolution
          </p>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Locate land parcels, compare reference registries against title evidence with AI assistance, and track grievance resolution with jurisdiction revenue officers.
          </p>

          {/* Quick Role Portal Buttons */}
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/citizen/locate"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition group"
            >
              <UserCheck className="w-5 h-5" /> Locate My Land & Jurisdiction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            
            <Link
              href="/citizen/raise-grievance"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition group"
            >
              <Briefcase className="w-5 h-5" /> Raise a Grievance
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Core Principle Banner */}
          <div className="mt-8 p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 uppercase block tracking-wider">Core Principle</span>
              <p>
                &quot;AI ASSISTS THE INVESTIGATION; THE AUTHORIZED OFFICER MAKES THE DECISION.&quot;
                Government records remain the authoritative source. LANDLENS provides a citizen-centric verification layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 How It Works Steps */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            How LANDLENS Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Locate & Verify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Search by District, Taluk, Village, or Survey Number to identify assigned revenue officers and reference land records.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">2. Raise Grievance & Upload Evidence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Submit your registered deed or patta document to flag potential mismatches in area, survey number, or ownership.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">3. AI Discrepancy Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Gemini AI extracts document text and compares it against reference records to generate advisory verification findings.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">4. Officer Resolution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Jurisdiction Tahsildars review findings, request evidence, resolve grievances, or escalate cases within SLA deadlines.</p>
          </div>
        </div>
      </section>

      {/* Featured Primary Verification Case Section */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              ⭐ Primary Verification Case Study
            </div>
            <h3 className="text-2xl font-bold text-white">Case GL-1024 (Survey Number Discrepancy)</h3>
            <p className="text-slate-400 text-sm">
              Citizen K. Kumar holds Patta <code className="text-blue-300">PT-10245</code> in Ambattur Kaveri Village.
            </p>
          </div>

          <Link
            href="/officer/case/GL-1024"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition flex items-center gap-2 shrink-0"
          >
            Inspect Case GL-1024 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-1 text-[11px] font-sans font-semibold">Government Reference Record:</span>
            <div className="text-slate-200">Patta Number: PT-10245</div>
            <div className="text-slate-200">Survey Number: <span className="text-emerald-400 font-bold">142/3B</span></div>
            <div className="text-slate-200">Owner Name: K Kumar (1.25 Acres)</div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-1 text-[11px] font-sans font-semibold">Citizen Uploaded Evidence (Sale Deed):</span>
            <div className="text-slate-200">Document No: SD/2024/99128</div>
            <div className="text-slate-200">Survey Number: <span className="text-amber-400 font-bold">142/3C</span></div>
            <div className="text-slate-200">Owner Stated: K Kumar (1.25 Acres)</div>
          </div>
        </div>
      </section>
    </div>
  );
}
