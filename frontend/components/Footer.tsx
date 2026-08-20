import React from 'react';
import { ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-400" /> Core Principle
            </h4>
            <p className="leading-relaxed">
              &quot;AI ASSISTS THE INVESTIGATION; THE AUTHORIZED OFFICER MAKES THE DECISION.&quot;
              LANDLENS does not make legal ownership decisions automatically.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" /> Data Source Constraint
            </h4>
            <p className="leading-relaxed">
              Government land records remain the authoritative source. LANDLENS provides a citizen-centric verification layer using reference datasets and API abstraction.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Hackathon Architecture
            </h4>
            <p className="leading-relaxed">
              Built with Next.js, FastAPI, PostgreSQL/SQLite, Gemini 1.5/3.6 AI Engine, Leaflet Maps, and Twilio SMS notification service fallback.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 LANDLENS - Citizen-Centric Land Record Verification & Grievance Resolution Platform</p>
          <div className="flex space-x-6">
            <span>Primary Case Study: GL-1024</span>
            <span>Master Verification Code: 123456</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
