'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, MapPin, FileText, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LandRecordDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <Link href="/citizen/land" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Land Search
        </Link>
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Government Reference Record
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Patta Reference Record: PT-10245</h1>
            <p className="text-xs text-slate-600">Location: Kaveri Village, Ambattur Taluk, Chennai District</p>
          </div>

          <Link
            href="/citizen/grievances/new"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            Report an Issue with This Record <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4 h-4 text-blue-600" /> Reference Record Key Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-slate-400 font-sans font-bold block text-[11px]">Patta Number</span>
            <div className="text-slate-900 font-bold text-lg">PT-10245</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-slate-400 font-sans font-bold block text-[11px]">Survey Number</span>
            <div className="text-emerald-700 font-bold text-lg">142/3B</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-slate-400 font-sans font-bold block text-[11px]">Registered Owner Name</span>
            <div className="text-slate-900 font-bold text-base">K. Kumar</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-slate-400 font-sans font-bold block text-[11px]">Parcel Extent & Classification</span>
            <div className="text-slate-900 font-bold text-base">1.25 Acres (Nanjai Wetland)</div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-900 block">Assigned Jurisdiction Officer</span>
          <div>Officer A — Tahsildar (Ambattur Revenue Jurisdiction)</div>
          <div className="text-[11px] text-slate-400">Official Email Domain: @landlens.gov.in</div>
        </div>
      </div>
    </div>
  );
}
