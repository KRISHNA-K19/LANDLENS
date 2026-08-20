'use client';

import React from 'react';
import { AlertTriangle, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AIFinding, DiscrepancyItem } from '@/lib/api';

interface AIFindingBadgeProps {
  finding?: AIFinding;
  compact?: boolean;
}

export default function AIFindingBadge({ finding, compact = false }: AIFindingBadgeProps) {
  if (!finding) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span>AI analysis pending or document processing in progress.</span>
      </div>
    );
  }

  const discrepancies = finding.discrepancies_json || [];
  const hasDiscrepancy = discrepancies.length > 0;

  return (
    <div className={`rounded-xl border ${hasDiscrepancy ? 'border-amber-300 bg-amber-50/60' : 'border-emerald-200 bg-emerald-50/50'} p-4 shadow-sm space-y-3`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${hasDiscrepancy ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              AI Investigation Engine
              <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                ADVISORY ONLY
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Confidence Summary: <span className="font-mono text-slate-700">{finding.confidence_summary}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Explanation */}
      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/80 p-2.5 rounded-lg border border-slate-200">
        &quot;{finding.summary_text}&quot;
      </p>

      {/* Discrepancy Items Grid */}
      {hasDiscrepancy ? (
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Flagged Potential Discrepancies:
          </h5>
          <div className="space-y-2">
            {discrepancies.map((item: DiscrepancyItem, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.field}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.severity === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-300' :
                    item.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {item.severity} SEVERITY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Reference Record:</span>
                    <span className="text-slate-800 font-bold">{item.reference_value}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-600 font-sans block">Submitted Evidence:</span>
                    <span className="text-amber-900 font-bold bg-amber-100/80 px-1 rounded">{item.submitted_value}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 italic">
                  Reason: {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-white p-2.5 rounded-lg border border-emerald-200 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No structural discrepancies detected between reference record and submitted evidence.</span>
        </div>
      )}

      {/* Advisory Guardrail */}
      <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-2 flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span>Official verification rests entirely with the assigned Jurisdiction Officer.</span>
      </div>
    </div>
  );
}
