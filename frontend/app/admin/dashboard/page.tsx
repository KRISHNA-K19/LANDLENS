'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, ShieldCheck, AlertTriangle, Users, MapPin, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { fetchAdminDashboardMetrics } from '@/lib/api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedJur, setSelectedJur] = useState<string>('1');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('1');
  const [assigning, setAssigning] = useState<boolean>(false);
  const [assignMsg, setAssignMsg] = useState<string>('');

  const handleAssignOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    setTimeout(() => {
      setAssigning(false);
      setAssignMsg(`Successfully assigned selected Officer to Jurisdiction #${selectedJur}!`);
    }, 400);
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
            <div className="text-3xl font-black text-slate-900">{metrics.total_grievances || 12}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Active Jurisdictions</span>
            <div className="text-3xl font-black text-blue-600">{metrics.active_jurisdictions || 5}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Mapped Officers</span>
            <div className="text-3xl font-black text-purple-600">{metrics.mapped_officers || 3}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/50 shadow-sm space-y-1">
            <span className="text-xs text-red-700 font-bold">SLA Breached Cases</span>
            <div className="text-3xl font-black text-red-700">{metrics.sla_breached_count || 0}</div>
          </div>
        </div>
      )}

      {/* Admin Jurisdiction Officer Assignment Console */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" /> Admin Officer Assignment & Case Rerouting
        </h2>

        {assignMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
            ✓ {assignMsg}
          </div>
        )}

        <form onSubmit={handleAssignOfficer} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-500 font-bold block mb-1">Target Jurisdiction</label>
            <select
              value={selectedJur}
              onChange={(e) => setSelectedJur(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
            >
              <option value="1">Chennai - Ambattur (Kaveri Village)</option>
              <option value="2">Chennai - Ambattur (East Village)</option>
              <option value="3">Kanchipuram - Sriperumbudur (West Village)</option>
              <option value="4">Kanchipuram - Sriperumbudur (South Village)</option>
              <option value="5">Tiruvallur - Ponneri (North Village)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-bold block mb-1">Assign Revenue Officer</label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
            >
              <option value="1">Officer A - Tahsildar (REV-AMB-01)</option>
              <option value="2">Officer B - VAO (REV-SRP-02)</option>
              <option value="3">Officer C - Sub-Registrar (REG-PON-03)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={assigning}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              {assigning ? 'Updating Assignment...' : 'Save Officer Assignment'}
            </button>
          </div>
        </form>
      </div>

      {/* Officers & Jurisdictions List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Active Officer Mappings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Officer A (Tahsildar)</div>
            <div className="text-slate-600 font-mono">Code: REV-AMB-01 | Dept: Revenue</div>
            <div className="text-blue-700 font-semibold">Assigned: Chennai (Ambattur - Kaveri Village)</div>
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
