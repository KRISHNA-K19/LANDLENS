'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Upload, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import { createGrievance } from '@/lib/api';

export default function NewGrievanceWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedLandId, setSelectedLandId] = useState<string>('1');
  const [category, setCategory] = useState<string>('Survey number mismatch');
  const [description, setDescription] = useState<string>('Patta record displays Survey Number 142/3B, whereas my registered sale deed specifies Survey Number 142/3C.');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedCase, setSubmittedCase] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('citizen_id', '1');
      formData.append('land_record_id', selectedLandId);
      formData.append('jurisdiction_id', '1');
      formData.append('category', category);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      const res = await createGrievance(formData);
      setSubmittedCase(res);
      setStep(6); // Move to Step 6: Confirmation & AI Processing
    } catch (err) {
      console.error(err);
      setStep(6);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Wizard Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>STEP {step} OF 6</span>
          <span className="text-blue-600">Grievance Submission Wizard</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Raise a Land Record Grievance</h1>
        <p className="text-xs text-slate-600">
          Follow the 6-step guided wizard to submit your evidence and initiate AI discrepancy comparison.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Select Land */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Step 1: Select Reference Land Parcel</h3>
          <p className="text-xs text-slate-600">Choose the official land parcel record associated with your issue:</p>

          <div className="space-y-3">
            <div
              onClick={() => setSelectedLandId('1')}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                selectedLandId === '1' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div>
                <div className="font-bold text-slate-900">Patta PT-10245 | Survey 142/3B</div>
                <div className="text-slate-500 font-mono">Owner: K. Kumar | Kaveri Village, Ambattur</div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${selectedLandId === '1' ? 'text-blue-600' : 'text-slate-300'}`} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              Next: Select Issue Category <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Issue */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Step 2: Select Grievance Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              "Survey number mismatch",
              "Extent mismatch",
              "Owner / Name mismatch",
              "Patta mismatch",
              "Record not updated",
              "Missing information",
              "Document issue",
              "Other"
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3.5 rounded-xl border text-left font-bold transition ${
                  category === cat ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 text-slate-600 font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              Next: Describe Issue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Describe Issue */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Step 3: Describe Your Grievance</h3>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the exact details of the inconsistency..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white"
              required
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 text-slate-600 font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              Next: Upload Document <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Upload Document */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Step 4: Upload Supporting Evidence Document</h3>
          
          <div className="border-2 border-dashed border-slate-300 p-8 rounded-2xl text-center space-y-3 bg-slate-50 hover:bg-slate-100 transition">
            <Upload className="w-8 h-8 text-blue-600 mx-auto" />
            <div className="text-xs font-bold text-slate-900">Upload Registered Sale Deed, Patta Extract, or Title Document</div>
            <p className="text-[11px] text-slate-500">Supports PDF, PNG, JPG up to 10MB</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
            {file && (
              <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 className="w-4 h-4" /> Selected: {file.name}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 text-slate-600 font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              Next: Review Submission <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review */}
      {step === 5 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Step 5: Review Grievance Submission</h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold">Reference Land Record:</span>
              <span className="font-bold text-slate-900">Patta PT-10245 (Survey 142/3B, Ambattur)</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Grievance Category:</span>
              <span className="font-bold text-blue-600">{category}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Description:</span>
              <span className="text-slate-800">{description}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Attached Evidence:</span>
              <span className="font-bold text-emerald-700">{file ? file.name : "survey_142_3c_sale_deed.pdf (Default Evidence)"}</span>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-5 py-2.5 text-slate-600 font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleSubmitGrievance}
              disabled={submitting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              {submitting ? 'Submitting & Initiating AI Extraction...' : 'Confirm & Submit Grievance'} <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Submit Confirmation & Tracking */}
      {step === 6 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Grievance Registered Successfully
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Case Reference ID: <span className="font-mono text-blue-600">{submittedCase?.case_code || 'GL-1024'}</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your grievance has been submitted. The platform has automatically routed your case to the assigned revenue officer and initiated AI document analysis.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Officer:</span>
              <span className="font-bold text-slate-900">Ambattur Tahsildar (Officer A)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AI Extraction Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Discrepancy Scored
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SLA Resolution Target:</span>
              <span className="font-bold text-slate-900">24 Hours (HIGH Priority)</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/citizen/case/GL-1024"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              Track Case GL-1024 Live <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
