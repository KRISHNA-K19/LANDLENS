'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileCheck, FileQuestion, ArrowUpRight } from 'lucide-react';
import { StatusHistoryItem } from '@/lib/api';

interface StatusTimelineProps {
  currentStatus: string;
  history?: StatusHistoryItem[];
}

const STAGES = [
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'AI_ANALYSIS_COMPLETED', label: 'AI Analysis' },
  { key: 'ADDITIONAL_DOCUMENTS_REQUIRED', label: 'Action Required', alt: 'ADDITIONAL_DOCUMENTS_REQUIRED' },
  { key: 'RESOLVED', label: 'Resolved', alt: 'RESOLVED' },
];

export default function StatusTimeline({ currentStatus, history = [] }: StatusTimelineProps) {
  const isResolved = currentStatus === 'RESOLVED';
  const isActionRequired = currentStatus === 'ADDITIONAL_DOCUMENTS_REQUIRED';
  const isEscalated = currentStatus === 'ESCALATED';

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" /> Case Status Timeline
        </h3>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isResolved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
          isActionRequired ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' :
          isEscalated ? 'bg-purple-100 text-purple-900 border-purple-300' :
          'bg-blue-100 text-blue-800 border-blue-300'
        }`}>
          {currentStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Progress Line */}
      <div className="relative flex items-center justify-between py-4 px-2">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
        
        {STAGES.map((stage, idx) => {
          const isActive = currentStatus === stage.key || currentStatus === stage.alt;
          const isPassed = history.some(h => h.new_status === stage.key || h.new_status === stage.alt);

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition border-2 ${
                isActive ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100' :
                isPassed ? 'bg-emerald-600 text-white border-emerald-600' :
                'bg-white text-slate-400 border-slate-300'
              }`}>
                {isPassed && !isActive ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`mt-2 text-[11px] font-medium text-center ${
                isActive ? 'text-blue-700 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* History Feed */}
      {history.length > 0 && (
        <div className="border-t border-slate-100 pt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity History</h4>
          {history.map((item, idx) => (
            <div key={idx} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">{item.changed_by_name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                    {item.changed_by_role}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="font-semibold text-blue-700">{item.new_status.replace(/_/g, ' ')}</span>
                </div>
                {item.remarks && (
                  <p className="text-slate-600 mt-1 italic">&quot;{item.remarks}&quot;</p>
                )}
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
