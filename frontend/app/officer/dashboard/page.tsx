'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Clock, AlertTriangle, CheckCircle2, Eye, Filter, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchOfficerCases, GrievanceSummary } from '@/lib/api';

export default function OfficerDashboard() {
  const [cases, setCases] = useState<GrievanceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadQueue();
  }, [filterStatus]);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchOfficerCases(1, filterStatus || undefined);
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalCount = cases.length;
  const pendingCount = cases.filter(c => c.status === 'SUBMITTED' || c.status === 'ASSIGNED').length;
  const reviewCount = cases.filter(c => c.status === 'UNDER_REVIEW' || c.status === 'AI_ANALYSIS_COMPLETED').length;
  const actionCount = cases.filter(c => c.status === 'ADDITIONAL_DOCUMENTS_REQUIRED').length;
  const resolvedCount = cases.filter(c => c.status === 'RESOLVED').length;
  const breachedCount = cases.filter(c => c.is_sla_breached).length;

  return (
    <div className="space-y-8 py-2">
      {/* Officer Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Officer Investigation Portal</h1>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded border border-amber-300">
              Officer A (Tahsildar)
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ambattur Revenue Jurisdiction Queue & Discrepancy Investigation Console
          </p>
        </div>

        <Link
          href="/officer/case/GL-1024"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Eye className="w-4 h-4 text-amber-200" /> Review Hackathon Case GL-1024 →
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium block">Total Assigned</span>
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium block">Pending</span>
          <span className="text-2xl font-black text-blue-600">{pendingCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium block">Under AI Review</span>
          <span className="text-2xl font-black text-purple-600">{reviewCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium block">Action Requested</span>
          <span className="text-2xl font-black text-amber-600">{actionCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium block">Resolved</span>
          <span className="text-2xl font-black text-emerald-600">{resolvedCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/50 shadow-2xs space-y-1">
          <span className="text-red-700 text-xs font-bold block">SLA Breached</span>
          <span className="text-2xl font-black text-red-700">{breachedCount}</span>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" /> Assigned Jurisdiction Case Queue
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ADDITIONAL_DOCUMENTS_REQUIRED">Action Required</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading officer queue...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Citizen</th>
                  <th className="p-3">Location / Village</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">SLA Status</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {cases.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-50 transition ${c.case_code === 'GL-1024' ? 'bg-amber-50/50 font-semibold' : ''}`}>
                    <td className="p-3">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.case_code}
                      </span>
                    </td>
                    <td className="p-3">{c.citizen_name}</td>
                    <td className="p-3 font-mono">{c.village}, {c.taluk}</td>
                    <td className="p-3">{c.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      {c.is_sla_breached ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> BREACHED
                        </span>
                      ) : (
                        <span className="text-slate-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" /> {Math.max(0, Math.floor(c.sla_remaining_seconds / 3600))}h remaining
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'ADDITIONAL_DOCUMENTS_REQUIRED' ? 'bg-amber-100 text-amber-900' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/officer/case/${c.case_code}`}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        Investigate <ArrowRight className="w-3 h-3" />
                      </Link>
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
