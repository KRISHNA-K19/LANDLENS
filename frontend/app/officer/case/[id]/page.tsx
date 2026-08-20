'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, FileText, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck, ArrowLeft, Send, FileQuestion, ArrowUpRight, Clock } from 'lucide-react';
import { fetchGrievanceDetail, submitOfficerAction, GrievanceDetail } from '@/lib/api';
import AIFindingBadge from '@/components/AIFindingBadge';

export default function OfficerCaseReviewPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<GrievanceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [remarks, setRemarks] = useState<string>('Please provide the registration document for verification.');
  const [submittingAction, setSubmittingAction] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const data = await fetchGrievanceDetail(caseId);
      setCaseData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType: 'RESOLVE' | 'REQUEST_ADDITIONAL_DOCUMENTS' | 'ESCALATE') => {
    if (!remarks.trim()) {
      alert("Please enter officer investigation remarks before submitting decision.");
      return;
    }

    setSubmittingAction(true);
    try {
      const updated = await submitOfficerAction(caseId, actionType, remarks, 1);
      setCaseData(updated);
      setActionSuccess(`Officer decision recorded successfully! Status updated to ${updated.status.replace(/_/g, ' ')}. Notification dispatched to citizen.`);
    } catch (err: any) {
      alert("Failed to submit action: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        Loading 3-column investigation console...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Case Not Found</h2>
        <Link href="/officer/dashboard" className="text-xs font-bold text-blue-600 hover:underline">
          ← Return to Officer Queue
        </Link>
      </div>
    );
  }

  const primaryDoc = caseData.documents?.[0];

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <Link href="/officer/dashboard" className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Queue
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 font-mono">{caseData.case_code}</h1>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded border border-amber-300">
              {caseData.category}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              caseData.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              caseData.status === 'ADDITIONAL_DOCUMENTS_REQUIRED' ? 'bg-amber-100 text-amber-900 border-amber-300' :
              'bg-blue-100 text-blue-800 border-blue-300'
            }`}>
              {caseData.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>Citizen: <span className="font-bold text-slate-900">{caseData.citizen?.name}</span> ({caseData.citizen?.phone})</div>
          <div>SLA Remaining: <span className="font-bold text-blue-700">{Math.max(0, Math.floor(caseData.sla_remaining_seconds / 3600))}h</span></div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 text-xs font-medium flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 3-COLUMN INVESTIGATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: LEFT - REFERENCE LAND RECORD (3 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-blue-600" /> Reference Record (Authoritative)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Survey Number:</span>
                  <span className="font-bold text-blue-700">{caseData.land_record?.survey_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patta Number:</span>
                  <span className="font-bold text-slate-900">{caseData.land_record?.patta_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patta Holder:</span>
                  <span className="font-bold text-slate-900">{caseData.land_record?.owner_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Land Extent:</span>
                  <span>{caseData.land_record?.extent_acres} Acres</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-[11px] space-y-1">
                <span className="font-bold text-blue-900 block uppercase tracking-wider text-[10px]">Jurisdiction Routing</span>
                <div>District: {caseData.jurisdiction?.district}</div>
                <div>Taluk: {caseData.jurisdiction?.taluk}</div>
                <div>Village: {caseData.jurisdiction?.village}</div>
                <div className="text-emerald-700 font-bold pt-1">Assigned: {caseData.jurisdiction?.officer_name}</div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Citizen Description:</span>
                &quot;{caseData.description}&quot;
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CENTER - UPLOADED EVIDENCE DOCUMENT PREVIEW (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-blue-600" /> Submitted Citizen Evidence
              </h3>

              {primaryDoc ? (
                <div className="mt-3 space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                    <div className="font-bold text-slate-900">{primaryDoc.file_name}</div>
                    <div className="text-[10px] text-slate-500">Type: {primaryDoc.file_type} | Size: {Math.round(primaryDoc.file_size / 1024)} KB</div>
                  </div>

                  {/* Document Simulated Viewer */}
                  <div className="border border-slate-300 rounded-xl p-4 bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed space-y-2 min-h-[220px]">
                    <div className="text-amber-400 font-bold text-[11px] border-b border-slate-800 pb-1 flex justify-between">
                      <span>DOCUMENT CONTENT EXTRACTION</span>
                      <span>PDF EXTRACT</span>
                    </div>
                    <p className="text-[11px] text-slate-300 whitespace-pre-line">
                      REGISTERED SALE DEED / LAND TITLE DOCUMENT
                      --------------------------------------------
                      Document No: SD/2024/99128
                      Village: {caseData.land_record?.village}
                      Taluk: {caseData.land_record?.taluk} | District: {caseData.land_record?.district}
                      Patta Number: {caseData.land_record?.patta_number}
                      Survey Number: 142/3C
                      Owner / Purchaser Name: K Kumar
                      Land Extent: {caseData.land_record?.extent_acres} Acres
                      --------------------------------------------
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  No evidence document attached.
                </div>
              )}
            </div>

            {primaryDoc && (
              <a
                href={`/uploads/${primaryDoc.file_name}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition text-center border border-slate-300 block"
              >
                Open Full Document Copy ↗
              </a>
            )}
          </div>
        </div>

        {/* COLUMN 3: RIGHT - AI FINDINGS & OFFICER DECISION FORM (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Explainable AI Finding Badge */}
          <AIFindingBadge finding={caseData.ai_findings?.[0]} />

          {/* Officer Decision Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Officer Verification & Decision
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Officer Investigation Remarks:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 font-medium"
                placeholder="Enter official investigation findings, rationale, or document requests..."
              />

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Select Officer Action:
                </span>

                <button
                  type="button"
                  disabled={submittingAction}
                  onClick={() => handleAction('REQUEST_ADDITIONAL_DOCUMENTS')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <FileQuestion className="w-4 h-4" /> Request Additional Document
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={submittingAction}
                    onClick={() => handleAction('RESOLVE')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-2xs flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Resolve Case
                  </button>

                  <button
                    type="button"
                    disabled={submittingAction}
                    onClick={() => handleAction('ESCALATE')}
                    className="py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition shadow-2xs flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Escalate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
