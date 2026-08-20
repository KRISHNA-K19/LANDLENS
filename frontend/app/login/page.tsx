'use client';

import React from 'react';
import Link from 'next/link';
import { User, ShieldCheck, Shield, ArrowRight } from 'lucide-react';

export default function LoginPortalSelectorPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Select Access Portal</h1>
        <p className="text-sm text-slate-600">
          Choose your dedicated role portal to authenticate into the LANDLENS verification ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Citizen Portal */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Citizen Portal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify land records, locate your parcel, submit grievance evidence, and track SLA timelines.
            </p>
          </div>
          <Link
            href="/login/citizen"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            Citizen Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Officer Portal */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Officer Portal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review assigned cases, inspect AI field extractions, request evidence, resolve or escalate cases.
            </p>
          </div>
          <Link
            href="/login/officer"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            Officer Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Admin Portal */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Admin Console</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage jurisdiction officer assignments, reassign cases, monitor SLA metrics and audit logs.
            </p>
          </div>
          <Link
            href="/login/admin"
            className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            Admin Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
