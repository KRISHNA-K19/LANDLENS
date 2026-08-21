'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, UserCheck, Briefcase, Settings, ArrowRight, CheckCircle2,
  ShieldAlert, Sparkles, FileText, Search, Cpu, Clock, Lock, FileSearch, ArrowDown
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 py-4">
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> AI-assisted. Human-verified.
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              LANDLENS
            </h1>
            <p className="text-2xl md:text-3xl text-blue-200 font-extrabold">
              &quot;Verify. Report. Resolve.&quot;
            </p>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
              An intelligent platform that helps citizens identify potential land-record discrepancies, submit evidence, and track grievance resolution transparently.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/access"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition group"
              >
                Report a Land Issue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              
              <a
                href="#how-it-works"
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl flex items-center gap-2 transition"
              >
                See How It Works <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Statement */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI identifies potential inconsistencies. Authorized officers make the final decision.</span>
            </div>
          </div>

          {/* Clean Product Visualization / Dashboard Preview */}
          <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-700 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[11px]">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-blue-400" /> Case GL-1024 Inspection
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold">
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

      {/* SECTION 2 — THE PROBLEM */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Land-record issues should not become paperwork nightmares.
          </h2>
          <p className="text-slate-600 text-sm">
            Traditional processes suffer from friction, lack of clarity, and limited citizen visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Difficult Grievance Submission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens struggle to identify the correct administrative jurisdiction and reference records to file a grievance accurately.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Manual Verification Backlog</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Revenue officers spend hours manually comparing dense multi-page title deeds against reference registry entries.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Limited Progress Visibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens lack real-time visibility into who is assigned to their case, status changes, and resolution timelines.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW LANDLENS WORKS */}
      <section id="how-it-works" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            How LANDLENS Works
          </h2>
          <p className="text-slate-600 text-sm">
            A transparent 5-step workflow linking citizens, AI assistance, and authorized officers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-black mx-auto">
              01
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Locate / Reference Land</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Identify parcel reference via map or location filters.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-black mx-auto">
              02
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Submit Grievance</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Upload registered deed evidence and state issue details.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-black mx-auto">
              03
            </div>
            <h4 className="font-bold text-slate-900 text-xs">AI-Assisted Extraction</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Gemini AI extracts text & compares fields against records.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-black mx-auto">
              04
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Officer Verification</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Tahsildar reviews findings and requests docs or resolves.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-black mx-auto">
              05
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Transparent Resolution</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">Case status updated with audit trail and citizen alert.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CORE DIFFERENTIATION */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8 border border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            More than a grievance portal.
          </h2>
          <p className="text-slate-400 text-sm">
            An end-to-end civic architecture designed for speed, explainability, and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" /> AI-assisted document understanding
            </h4>
            <p className="text-slate-300 leading-relaxed">Multimodal extraction turns unstructured sale deeds into structured JSON fields.</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4" /> Field-level discrepancy detection
            </h4>
            <p className="text-slate-300 leading-relaxed">Rule-based scoring checks Survey Numbers, Owner Names, and Parcel Extents.</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Jurisdiction-aware routing
            </h4>
            <p className="text-slate-300 leading-relaxed">Automatically matches District, Taluk, and Village to assigned Tahsildars.</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Human verification
            </h4>
            <p className="text-slate-300 leading-relaxed">Officers make final administrative decisions; AI never issues legal orders.</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> SLA monitoring
            </h4>
            <p className="text-slate-300 leading-relaxed">Strict 24h, 48h, and 72h SLA deadlines prevent cases from lingering indefinitely.</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" /> Transparent audit trail
            </h4>
            <p className="text-slate-300 leading-relaxed">Immutable system logs capture every event for administrative accountability.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — AI SAFETY */}
      <section className="bg-amber-50/60 p-8 rounded-3xl border border-amber-200/80 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
              Responsible AI Protocol
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              &quot;AI assists. Officers decide.&quot;
            </h2>
          </div>

          <div className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 shrink-0">
            LANDLENS never treats an AI prediction as a final legal decision.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-bold pt-2">
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">Citizen Document</div>
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">AI Extraction</div>
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">Potential Discrepancy</div>
          <div className="bg-amber-600 text-white p-3 rounded-xl shadow-sm">Officer Verification</div>
          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-sm">Final Decision</div>
        </div>
      </section>

      {/* SECTION 6 — ROLE ACCESS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Dedicated Workspaces
          </h2>
          <p className="text-slate-600 text-sm">
            Select your role to access customized dashboards, workflows, and permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">CITIZEN</h3>
              <p className="text-xs text-slate-600">Report and track land-record grievances.</p>
            </div>
            <Link href="/citizen/login" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
              Citizen Login <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">OFFICER</h3>
              <p className="text-xs text-slate-600">Review assigned cases and resolve grievances.</p>
            </div>
            <Link href="/officer/login" className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
              Officer Login <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">ADMIN</h3>
              <p className="text-xs text-slate-600">Monitor operations, officers, SLA and audit activity.</p>
            </div>
            <Link href="/admin/login" className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
              Admin Login <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — IMPACT (DEMO METRICS) */}
      <section className="bg-slate-100 p-8 rounded-3xl border border-slate-200 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">PROTOTYPE STATISTICS</span>
          <h3 className="font-extrabold text-slate-900 text-xl">Platform Capacity Metrics</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-3xl font-black text-blue-600">50+</div>
            <div className="text-xs text-slate-500 font-medium">Reference Records (Demo)</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-3xl font-black text-emerald-600">3</div>
            <div className="text-xs text-slate-500 font-medium">Operational Roles</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-3xl font-black text-purple-600">Field-level</div>
            <div className="text-xs text-slate-500 font-medium">Verification Engine</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-3xl font-black text-amber-600">End-to-end</div>
            <div className="text-xs text-slate-500 font-medium">Case Tracking</div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FOOTER */}
      <footer className="border-t border-slate-200 pt-8 space-y-6 text-xs text-slate-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-extrabold text-slate-900 text-base block">LANDLENS</span>
            <p className="text-slate-500 text-xs">AI-assisted civic grievance resolution.</p>
          </div>

          <div className="flex flex-wrap gap-6 font-medium">
            <a href="#how-it-works" className="hover:text-slate-900">How It Works</a>
            <Link href="/access" className="hover:text-slate-900">Role Access</Link>
            <Link href="/citizen/login" className="hover:text-slate-900">Citizen Login</Link>
            <Link href="/officer/login" className="hover:text-slate-900">Officer Login</Link>
            <Link href="/admin/login" className="hover:text-slate-900">Admin Login</Link>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4 text-center text-slate-400">
          © 2026 LANDLENS - Citizen-Centric Land Record Verification Platform
        </div>
      </footer>
    </div>
  );
}
