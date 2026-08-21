'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, ShieldCheck, MapPin, Clock, Upload, CheckCircle2, AlertTriangle, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { fetchGrievanceDetail, GrievanceDetail, apiClient } from '@/lib/api';
import StatusTimeline from '@/components/StatusTimeline';
import AIFindingBadge from '@/components/AIFindingBadge';

export default function CitizenCaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [grievance, setGrievance] = useState<GrievanceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [additionalFile, setAdditionalFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const data = await fetchGrievanceDetail(caseId);
      setGrievance(data);
    } catch (err: any) {
      console.error(err);
      setError('Case not found or unable to load details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalFile || !grievance) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', additionalFile);
      
      await apiClient.post(`/grievances/${grievance.id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadSuccess('Additional document uploaded successfully! Officer notified.');
      setAdditionalFile(null);
      loadCase();
    } catch (err: any) {
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        Loading case tracking details...
      </div>
    );
  }

  if (error || !grievance) {
    return (
      <div className="p-8 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">{error || 'Case not found'}</h2>
        <Link href="/citizen/dashboard" className="text-xs font-bold text-blue-600 hover:underline">
          ← Return to My Grievances Dashboard
        </Link>
      </div>
    );
  }

  const isActionRequired = grievance.status === 'ADDITIONAL_DOCUMENTS_REQUIRED';

  return (
    <div className="space-y-6 py-2">
      {/* Top Back Link & Case Code Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/citizen/dashboard" className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Grievances
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 font-mono">{grievance.case_code}</h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded border border-blue-200">
              {grievance.category}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div>Created: {new Date(grievance.created_at).toLocaleDateString()}</div>
          <div>Assigned Officer: <span className="font-bold text-blue-700">{grievance.jurisdiction?.officer_name || 'Tahsildar'}</span></div>
        </div>
      </div>

      {/* Case Status Timeline */}
      <StatusTimeline currentStatus={grievance.status} history={grievance.status_history} />

      {/* Action Required Banner if Requested by Officer */}
      {isActionRequired && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 space-y-4 shadow-sm animate-pulse-subtle">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-900 text-base">Additional Documents Requested by Officer</h3>
              <p className="text-xs text-amber-800">
                The assigned Jurisdiction Officer has reviewed your case and requested additional document verification.
              </p>
              {grievance.officer_actions.length > 0 && (
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs font-medium text-slate-800 italic mt-2">
                  Officer Remarks: &quot;{grievance.officer_actions[grievance.officer_actions.length - 1].remarks}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Form to submit requested doc */}
          <form onSubmit={handleAdditionalUpload} className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Upload Requested Document</h4>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => e.target.files && setAdditionalFile(e.target.files[0])}
                className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="submit"
                disabled={!additionalFile || uploading}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 shrink-0"
              >
                {uploading ? 'Uploading...' : 'Submit Additional Document'}
              </button>
            </div>
            {uploadSuccess && (
              <p className="text-xs text-emerald-700 font-bold">{uploadSuccess}</p>
            )}
          </form>
        </div>
      )}

      {/* Grid: Left Land Reference, Right AI & Officer Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Land Reference & Uploaded Files */}
        <div className="space-y-6">
          {/* Reference Record Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Reference Land Record Details
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-800">
              <div className="flex justify-between">
                <span>Survey Number:</span>
                <span className="font-bold text-blue-700">{grievance.land_record?.survey_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Patta Number:</span>
                <span className="font-bold">{grievance.land_record?.patta_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Record Holder / Owner:</span>
                <span className="font-bold">{grievance.land_record?.owner_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Recorded Extent:</span>
                <span>{grievance.land_record?.extent_acres} Acres</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1">
                <span>Jurisdiction Village:</span>
                <span>{grievance.land_record?.village}, {grievance.land_record?.taluk}</span>
              </div>
            </div>
          </div>

          {/* Uploaded Evidence Documents */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Submitted Evidence Documents ({grievance.documents?.length || 0})
            </h3>

            <div className="space-y-2">
              {grievance.documents?.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div className="font-mono">
                    <div className="font-bold text-slate-800">{doc.file_name}</div>
                    <div className="text-[10px] text-slate-400">
                      Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const docUrl = '/uploads/survey_142_3c_sale_deed.html';
                      window.open(docUrl, '_blank');
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline bg-blue-50 px-2.5 py-1 rounded border border-blue-200"
                  >
                    View Document ↗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Findings & Officer Remarks */}
        <div className="space-y-6">
          {/* AI Finding Badge */}
          <AIFindingBadge finding={grievance.ai_findings?.[0]} />

          {/* Officer Remarks & Decision Audit */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Officer Investigation Remarks
            </h3>

            {grievance.officer_actions && grievance.officer_actions.length > 0 ? (
              <div className="space-y-3">
                {grievance.officer_actions.map((act) => (
                  <div key={act.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{act.officer_name} ({act.officer_designation})</span>
                      <span className="font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-slate-700 italic font-medium">&quot;{act.remarks}&quot;</p>
                    <span className="text-[10px] text-slate-400 block text-right">
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                Officer investigation in progress. No remarks posted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
