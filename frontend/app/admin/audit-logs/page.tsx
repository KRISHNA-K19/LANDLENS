'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Clock, User, FileText, Lock } from 'lucide-react';
import { fetchAuditLogs } from '@/lib/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <Link href="/admin/dashboard" className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Immutable Audit Trail</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <Lock className="w-3 h-3" /> VERIFIED LOGS
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Immutable log record of all citizen submissions, AI investigations, officer decisions, and system status changes.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg border border-slate-300 transition"
        >
          Refresh Audit Feed
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading immutable audit logs...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">Case Code</th>
                  <th className="p-3">Event Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-sans font-bold text-slate-900">{log.actor_name}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 font-sans text-[10px] font-bold px-2 py-0.5 rounded">
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-blue-700">{log.action}</td>
                    <td className="p-3">
                      {log.case_code ? (
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold">
                          {log.case_code}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-[11px] text-slate-600 max-w-xs truncate">
                      {log.metadata_json ? JSON.stringify(log.metadata_json) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
