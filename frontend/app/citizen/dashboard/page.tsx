'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, MapPin, Plus, Clock, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient, GrievanceSummary } from '@/lib/api';

export default function CitizenDashboard() {
  const [grievances, setGrievances] = useState<GrievanceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadGrievances();
  }, [filterStatus]);

  const loadGrievances = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/grievances', {
        params: { citizen_id: 1, status: filterStatus || undefined }
      });
      setGrievances(res.data);
    } catch (err) {
      console.error("Failed to load grievances", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Citizen Grievance Portal</h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
              Citizen: K. Kumar
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Track active land record verification requests and inspect officer updates.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/citizen/locate"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl text-sm transition flex items-center gap-2 border border-slate-300"
          >
            <MapPin className="w-4 h-4 text-blue-600" /> Locate My Land
          </Link>
          <Link
            href="/citizen/raise-grievance"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Raise Grievance
          </Link>
        </div>
      </div>

      {/* Filter & Cases List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> My Registered Cases ({grievances.length})
          </h2>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ADDITIONAL_DOCUMENTS_REQUIRED">Action Required</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            Loading land record grievances...
          </div>
        ) : grievances.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium text-sm">No grievances found matching criteria.</p>
            <Link href="/citizen/raise-grievance" className="text-xs font-bold text-blue-600 hover:underline inline-block">
              Click here to submit your first grievance →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grievances.map((g) => (
              <div
                key={g.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {g.case_code}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      g.status === 'ADDITIONAL_DOCUMENTS_REQUIRED' ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' :
                      'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {g.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{g.category}</h3>

                  <div className="text-xs text-slate-600 space-y-1 font-mono">
                    <div>Location: {g.village}, {g.taluk}, {g.district}</div>
                    <div>Survey No: {g.survey_number} | Patta No: {g.patta_number}</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    SLA Deadline: <span className="font-medium text-slate-700">{Math.max(0, Math.floor(g.sla_remaining_seconds / 3600))}h remaining</span>
                  </span>

                  <Link
                    href={`/citizen/case/${g.case_code}`}
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Status & Timeline <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
