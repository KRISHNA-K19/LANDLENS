'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, ShieldCheck, AlertTriangle, Users, MapPin, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { fetchAdminDashboardMetrics } from '@/lib/api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Administration Console</h1>
            <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-300">
              System Admin
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Platform governance, SLA breach tracking, officer mappings, and audit logging.
          </p>
        </div>

        <Link
          href="/admin/audit-logs"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> View Immutable Audit Trail →
        </Link>
      </div>

      {/* Metrics Row */}
      {loading || !metrics ? (
        <div className="p-8 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          Loading administration metrics...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Registered Cases</span>
            <div className="text-3xl font-black text-slate-900">{metrics.total_grievances || 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Active Jurisdictions</span>
            <div className="text-3xl font-black text-blue-600">{metrics.active_jurisdictions || 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Mapped Officers</span>
            <div className="text-3xl font-black text-purple-600">{metrics.mapped_officers || 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/50 shadow-sm space-y-1">
            <span className="text-xs text-red-700 font-bold">SLA Breached Cases</span>
            <div className="text-3xl font-black text-red-700">{metrics.sla_breached_count || 0}</div>
          </div>
        </div>
      )}

      {/* Officers & Jurisdictions List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Revenue Officers & Jurisdiction Mapping
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Officer A (Tahsildar)</div>
            <div className="text-slate-600 font-mono">Code: REV-AMB-01 | Dept: Revenue</div>
            <div className="text-blue-700 font-semibold">Assigned: Chennai (Ambattur)</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Officer B (VAO)</div>
            <div className="text-slate-600 font-mono">Code: REV-SRP-02 | Dept: Revenue</div>
            <div className="text-blue-700 font-semibold">Assigned: Kanchipuram (Sriperumbudur)</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Officer C (Sub-Registrar)</div>
            <div className="text-slate-600 font-mono">Code: REG-PON-03 | Dept: Registration</div>
            <div className="text-blue-700 font-semibold">Assigned: Tiruvallur (Ponneri)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
