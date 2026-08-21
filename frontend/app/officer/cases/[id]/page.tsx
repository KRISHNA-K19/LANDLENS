'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ShieldCheck, FileText, Cpu, AlertTriangle, CheckCircle2,
  Clock, Upload, Send, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { fetchGrievanceDetail, submitOfficerAction } from '@/lib/api';

export default function OfficerCaseDetailPage({ params }: { params: { id: string } }) {
  const caseId = params.id || 'GL-1024';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Action Dialog States
  const [activeModal, setActiveModal] = useState<'RESOLVE' | 'REQUEST_DOCS' | 'ESCALATE' | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [executing, setExecuting] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  useEffect(() => {
    loadCaseData();
  }, [caseId]);

  const loadCaseData = async () => {
    setLoading(true);
    try {
      const res = await fetchGrievanceDetail(caseId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!activeModal || !remarks.trim()) {
      alert("Please provide required remarks for this action.");
      return;
    }
    setExecuting(true);
    try {
      const actionType = activeModal === 'RESOLVE' ? 'RESOLVE' : activeModal === 'REQUEST_DOCS' ? 'REQUEST_ADDITIONAL_DOCUMENTS' : 'ESCALATE';
      const updated = await submitOfficerAction(caseId, actionType, remarks, 1);
      setData(updated);
      setActionSuccess(`Officer action '${actionType}' recorded successfully!`);
      setActiveModal(null);
      setRemarks('');
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading case workspace...
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <Link href="/officer/dashboard" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Queue
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Case {data.case_code}</h1>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              {data.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Assigned Officer: Ambattur Tahsildar (Officer A) | Jurisdiction: Kaveri Village
          </p>
        </div>

        {/* SLA Counter */}
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs font-mono">
          <Clock className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">SLA Deadline Status:</span>
            <span className="text-amber-400 font-bold">18h 42m Remaining (HIGH Priority)</span>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Case Info + Grievance Details + Document Viewer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Citizen Grievance Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-blue-600" /> Citizen Grievance Statement & Land Reference
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">Citizen Name:</span>
                <span className="font-bold text-slate-900">{data.citizen?.name || 'K. Kumar'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">Grievance Category:</span>
                <span className="font-bold text-blue-600">{data.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">Reference Patta:</span>
                <span className="font-bold text-slate-900">PT-10245</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">Reference Survey:</span>
                <span className="font-bold text-emerald-700">142/3B</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Citizen Statement:</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                {data.description}
              </p>
            </div>
          </div>

          {/* Document Viewer Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Uploaded Title Deed Document Evidence
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                survey_142_3c_sale_deed.pdf
              </span>
            </div>

            <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-2 flex justify-between">
                <span>REGISTERED SALE DEED EXTRACT</span>
                <span>DOC NO: SD/2024/99128</span>
              </div>
              <div className="text-slate-300">Target Village: Kaveri Village (Ambattur Taluk)</div>
              <div className="text-slate-300">Stated Owner Name: K. Kumar</div>
              <div className="text-amber-300 font-bold">Stated Survey Identifier: 142/3C</div>
              <div className="text-slate-300">Stated Parcel Extent: 1.25 Acres</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Extraction + Field Comparison Table + Discrepancy Findings + Officer Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Discrepancy Comparison Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" /> Field Comparison Matrix
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                HIGH CONFIDENCE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-sans font-bold">
                  <tr>
                    <th className="p-2">FIELD</th>
                    <th className="p-2">REFERENCE</th>
                    <th className="p-2">SUBMITTED</th>
                    <th className="p-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-amber-50/50">
                    <td className="p-2 font-bold font-sans text-slate-900">Survey No</td>
                    <td className="p-2 text-emerald-700 font-bold">142/3B</td>
                    <td className="p-2 text-amber-700 font-bold">142/3C</td>
                    <td className="p-2 text-amber-700 font-bold text-[10px]">POTENTIAL DISCREPANCY</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-bold text-slate-900">Patta No</td>
                    <td className="p-2 text-slate-700">PT-10245</td>
                    <td className="p-2 text-slate-700">PT-10245</td>
                    <td className="p-2 text-emerald-600 font-bold text-[10px]">MATCH</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-bold text-slate-900">Owner Name</td>
                    <td className="p-2 text-slate-700">K. Kumar</td>
                    <td className="p-2 text-slate-700">K. Kumar</td>
                    <td className="p-2 text-emerald-600 font-bold text-[10px]">MATCH</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-bold text-slate-900">Extent</td>
                    <td className="p-2 text-slate-700">1.25 Acres</td>
                    <td className="p-2 text-slate-700">1.25 Acres</td>
                    <td className="p-2 text-emerald-600 font-bold text-[10px]">MATCH</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Advisory Finding:
              </span>
              <p className="text-[11px]">
                Survey number mismatch detected (Ref 142/3B vs Deed 142/3C). Authorized officer verification required.
              </p>
            </div>
          </div>

          {/* OFFICER ACTION BUTTONS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Officer Action & Administrative Decision
            </h3>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveModal('RESOLVE')}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                ✓ RESOLVE GRIEVANCE
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('REQUEST_DOCS')}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                ? REQUEST ADDITIONAL DOCUMENTS
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('ESCALATE')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                ↑ ESCALATE CASE TO SUPERIOR AUTHORITY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION DIALOG MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">
              {activeModal === 'RESOLVE' && 'Confirm Case Resolution'}
              {activeModal === 'REQUEST_DOCS' && 'Request Additional Evidence'}
              {activeModal === 'ESCALATE' && 'Escalate Case'}
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {activeModal === 'RESOLVE' && 'Resolution Remarks & Instructions:'}
                {activeModal === 'REQUEST_DOCS' && 'Specify Required Documents:'}
                {activeModal === 'ESCALATE' && 'Escalation Reason:'}
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="State your official officer remarks..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={executing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                {executing ? 'Saving Action...' : 'Submit Officer Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
