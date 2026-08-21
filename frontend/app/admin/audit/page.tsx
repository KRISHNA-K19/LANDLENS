'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Search } from 'lucide-react';

export default function AdminAuditLogPage() {
  const auditLogs = [
    {
      id: 1,
      timestamp: "2026-08-21 09:42:15",
      actor: "Officer A (REV-AMB-01)",
      role: "OFFICER",
      action: "REQUEST_ADDITIONAL_DOCUMENTS",
      case_id: "GL-1024",
      description: "Requested additional title verification documents for survey 142/3B vs 142/3C."
    },
    {
      id: 2,
      timestamp: "2026-08-21 09:12:00",
      actor: "Gemini AI Engine",
      role: "SYSTEM",
      action: "AI_DISCREPANCY_ANALYSIS",
      case_id: "GL-1024",
      description: "Extracted document fields and flagged Survey Number discrepancy (142/3B vs 142/3C)."
    },
    {
      id: 3,
      timestamp: "2026-08-21 09:10:04",
      actor: "Citizen K. Kumar",
      role: "CITIZEN",
      action: "GRIEVANCE_SUBMITTED",
      case_id: "GL-1024",
      description: "Submitted grievance for Patta PT-10245 with sale deed evidence file."
    },
    {
      id: 4,
      timestamp: "2026-08-21 08:30:00",
      actor: "Admin Console (ADMIN-01)",
      role: "ADMIN",
      action: "JURISDICTION_ASSIGNED",
      case_id: "N/A",
      description: "Assigned Officer A to Kaveri Village jurisdiction."
    }
  ];

  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-purple-700" /> Immutable System Audit Trail
          </h1>
          <p className="text-xs text-slate-600">Cryptographically verifiable, read-only system event logs for administrative accountability.</p>
        </div>

        <span className="bg-purple-100 text-purple-800 text-xs font-mono font-bold px-3 py-1 rounded-full border border-purple-200">
          READ-ONLY AUDIT LOGS
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 font-sans font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">TIMESTAMP</th>
              <th className="p-4">ACTOR</th>
              <th className="p-4">ROLE</th>
              <th className="p-4">ACTION</th>
              <th className="p-4">CASE ID</th>
              <th className="p-4">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition">
                <td className="p-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                <td className="p-4 font-bold text-slate-900">{log.actor}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-sans ${
                    log.role === 'CITIZEN' ? 'bg-blue-100 text-blue-800' :
                    log.role === 'OFFICER' ? 'bg-emerald-100 text-emerald-800' :
                    log.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {log.role}
                  </span>
                </td>
                <td className="p-4 font-bold text-blue-700">{log.action}</td>
                <td className="p-4 font-bold text-amber-700">
                  {log.case_id !== 'N/A' ? (
                    <Link href={`/citizen/case/${log.case_id}`} className="hover:underline">
                      {log.case_id}
                    </Link>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="p-4 text-slate-600 font-sans text-xs">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
