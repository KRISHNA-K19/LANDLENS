'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { createGrievance, fetchLandRecords, LandRecord } from '@/lib/api';

const CATEGORIES = [
  "Survey number mismatch",
  "Owner/Name mismatch",
  "Extent/area mismatch",
  "Missing information",
  "Record not updated",
  "Document unclear",
  "Other"
];

function RaiseGrievanceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [landRecords, setLandRecords] = useState<LandRecord[]>([]);
  const [selectedLandId, setSelectedLandId] = useState<string>('');
  const [category, setCategory] = useState<string>('Survey number mismatch');
  const [description, setDescription] = useState<string>(
    'The survey number recorded in my online Patta record shows 142/3B, but my registered sale deed clearly specifies Survey Number 142/3C.'
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadLandRecords();
  }, []);

  const loadLandRecords = async () => {
    try {
      const records = await fetchLandRecords();
      setLandRecords(records);
      const paramLandId = searchParams.get('land_id');
      if (paramLandId) {
        setSelectedLandId(paramLandId);
      } else if (records.length > 0) {
        setSelectedLandId(records[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandId) {
      setError('Please select a land record.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a grievance description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('land_record_id', selectedLandId);
      formData.append('category', category);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      const newGrievance = await createGrievance(formData);
      router.push(`/citizen/case/${newGrievance.case_code}`);
    } catch (err: any) {
      console.error("Submission failed", err);
      setError(err.response?.data?.detail || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRecord = landRecords.find(r => r.id.toString() === selectedLandId);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Land Record Reference Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          1. Select Land Record Reference
        </label>
        <select
          value={selectedLandId}
          onChange={(e) => setSelectedLandId(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
        >
          {landRecords.map((r) => (
            <option key={r.id} value={r.id}>
              Patta: {r.patta_number} | Survey: {r.survey_number} | Owner: {r.owner_name} ({r.village})
            </option>
          ))}
        </select>

        {selectedRecord && (
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs font-mono space-y-1 text-slate-700">
            <span className="font-sans font-bold text-blue-900 block text-[11px]">Selected Reference Record Data:</span>
            <div>Survey Number: <span className="font-bold text-blue-700">{selectedRecord.survey_number}</span></div>
            <div>Owner Name: {selectedRecord.owner_name} ({selectedRecord.extent_acres} Acres)</div>
            <div>Location: {selectedRecord.village}, {selectedRecord.taluk}, {selectedRecord.district}</div>
          </div>
        )}
      </div>

      {/* 2. Category Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          2. Grievance Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                category === cat
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Description */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          3. Grievance Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Explain the discrepancy between your physical/registered document and the online record..."
        />
      </div>

      {/* 4. Document File Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          4. Upload Supporting Evidence (PDF / Image)
        </label>
        
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition bg-slate-50/50">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="evidence-file-input"
          />
          <label htmlFor="evidence-file-input" className="cursor-pointer space-y-2 block">
            <Upload className="w-8 h-8 text-blue-600 mx-auto" />
            <div className="text-xs font-bold text-slate-800">
              {file ? file.name : "Click to select or drag & drop registered title deed / patta copy"}
            </div>
            <p className="text-[11px] text-slate-400">Accepted formats: PDF, PNG, JPG, JPEG (Max 10MB)</p>
          </label>
        </div>

        <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>AI Investigation Engine will automatically extract fields and compare with reference record.</span>
        </div>
      </div>

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <span>Processing Document & Routing Case...</span>
        ) : (
          <>
            <span>Submit Grievance & Trigger AI Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function RaiseGrievancePage() {
  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Step 3: Grievance & Evidence Submission
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Raise Land Record Grievance</h1>
        <p className="text-sm text-slate-600">
          Select your land reference record, specify the discrepancy category, and upload your supporting document for AI investigation.
        </p>
      </div>

      <Suspense fallback={
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          Loading grievance submission form...
        </div>
      }>
        <RaiseGrievanceForm />
      </Suspense>
    </div>
  );
}
