'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Briefcase, Settings, ArrowRight, FileCheck2, Search, Cpu, BellRing, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Civic-Tech Hackathon MVP
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            LANDLENS
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-medium">
            Citizen-Centric Land Record Verification & Grievance Resolution
          </p>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            &quot;Make land-record grievances easier to submit, easier to investigate, and easier to track.&quot;
          </p>

          {/* Quick Role Portal Buttons */}
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/citizen/dashboard"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition group"
            >
              <UserCheck className="w-5 h-5" /> Citizen Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            
            <Link
              href="/officer/dashboard"
              className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition group"
            >
              <Briefcase className="w-5 h-5" /> Officer Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/dashboard"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <Settings className="w-5 h-5" /> Admin Login
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

      {/* 3 Core Value Propositions */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Engineered for Every Stakeholder
          </h2>
          <p className="text-slate-600 text-sm">
            Bridging citizens, revenue officers, and administration with explainable AI and transparent tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Citizen Value Prop */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Citizen: Submit & Track</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Locate land on interactive map
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reference patta & survey records
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Upload registered deeds & title evidence
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time status timeline & SMS alerts
              </li>
            </ul>
            <Link href="/citizen/dashboard" className="block pt-2 text-xs font-bold text-blue-600 hover:underline">
              Open Citizen Portal →
            </Link>
          </div>

          {/* Officer Value Prop */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Officer: Investigate with AI</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Auto-routed jurisdiction queue
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3-column evidence inspection screen
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI discrepancy detection (Survey/Owner/Extent)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Action workflow: Resolve, Request Docs, Escalate
              </li>
            </ul>
            <Link href="/officer/dashboard" className="block pt-2 text-xs font-bold text-amber-600 hover:underline">
              Open Officer Portal →
            </Link>
          </div>

          {/* Admin Value Prop */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Admin: Monitor & Audit</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SLA breach monitoring (24h/48h/72h)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Jurisdiction officer workload stats
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Immutable audit log of all system events
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparent civic metrics
              </li>
            </ul>
            <Link href="/admin/dashboard" className="block pt-2 text-xs font-bold text-slate-700 hover:underline">
              Open Admin Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hackathon Demo Case Section */}
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
