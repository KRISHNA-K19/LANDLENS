'use client';

import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle2, Settings } from 'lucide-react';

export default function AdminSLAPage() {
  const [slaRules, setSlaRules] = useState([
    { priority: "HIGH", hours: 24, active_cases: 2, breached: 0, desc: "Urgent survey number & ownership mismatches" },
    { priority: "MEDIUM", hours: 48, active_cases: 5, breached: 0, desc: "Extent parcel area discrepancy" },
    { priority: "LOW", hours: 72, active_cases: 5, breached: 0, desc: "General record mutation delay" },
  ]);

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-700" /> Service Level Agreement (SLA) Rule Configurator
        </h1>
        <p className="text-xs text-slate-600 mt-1">Configure resolution timeframe deadlines based on grievance priority classification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slaRules.map((rule) => (
          <div key={rule.priority} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                rule.priority === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' :
                rule.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {rule.priority} PRIORITY
              </span>
              <span className="font-mono font-bold text-slate-900 text-lg">{rule.hours} Hours</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs font-mono">
              <span className="text-slate-500">Active Cases: <strong className="text-slate-900">{rule.active_cases}</strong></span>
              <span className="text-slate-500">Breached: <strong className="text-emerald-600">{rule.breached}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
