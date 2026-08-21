'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, Settings, Plus, CheckCircle2 } from 'lucide-react';

interface JurisdictionItem {
  id: number;
  district: string;
  taluk: string;
  village: string;
  officer: string;
}

export default function AdminJurisdictionsPage() {
  const [jurisdictions, setJurisdictions] = useState<JurisdictionItem[]>([
    { id: 1, district: "Chennai", taluk: "Ambattur", village: "Kaveri Village", officer: "Officer A (Tahsildar)" },
    { id: 2, district: "Chennai", taluk: "Ambattur", village: "East Village", officer: "Officer A (Tahsildar)" },
    { id: 3, district: "Kanchipuram", taluk: "Sriperumbudur", village: "West Village", officer: "Officer B (VAO)" },
    { id: 4, district: "Kanchipuram", taluk: "Sriperumbudur", village: "South Village", officer: "Officer B (VAO)" },
    { id: 5, district: "Tiruvallur", taluk: "Ponneri", village: "North Village", officer: "Officer C (Sub-Registrar)" },
  ]);

  const [selectedJur, setSelectedJur] = useState<number | null>(null);
  const [targetOfficer, setTargetOfficer] = useState<string>("Officer A (Tahsildar)");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('landlens_admin_jurisdictions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setJurisdictions([...parsed, ...jurisdictions.filter(j => !parsed.some((p: any) => p.village === j.village))]);
          }
        } catch (e) {}
      }
    }
  }, []);

  const handleUpdateMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJur) return;
    const updated = jurisdictions.map(j => j.id === selectedJur ? { ...j, officer: targetOfficer } : j);
    setJurisdictions(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('landlens_admin_jurisdictions', JSON.stringify(updated));
    }
    setSelectedJur(null);
  };

  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-700" /> Administrative Jurisdiction Hierarchy
          </h1>
          <p className="text-xs text-slate-600">Configure administrative boundary routing: District ➔ Taluk ➔ Village ➔ Assigned Revenue Officer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jurisdictions.map((j) => (
          <div key={j.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2 text-xs">
              <div className="text-blue-600 font-bold uppercase text-[10px]">{j.district} District</div>
              <h3 className="font-extrabold text-slate-900 text-base">{j.village}</h3>
              <div className="text-slate-500 font-mono">Taluk: {j.taluk}</div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-400">Assigned Officer:</span>
                <span className="font-bold text-emerald-700">{j.officer}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedJur(j.id)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition mt-2"
            >
              Reassign Jurisdiction Officer
            </button>
          </div>
        ))}
      </div>

      {selectedJur && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdateMapping} className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Reassign Officer to Jurisdiction #{selectedJur}</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Revenue Officer</label>
              <select
                value={targetOfficer}
                onChange={(e) => setTargetOfficer(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="Officer A (Tahsildar)">Officer A (Tahsildar)</option>
                <option value="Officer B (VAO)">Officer B (VAO)</option>
                <option value="Officer C (Sub-Registrar)">Officer C (Sub-Registrar)</option>
                <option value="Officer D (Revenue Inspector)">Officer D (Revenue Inspector)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedJur(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-700 text-white font-bold rounded-xl text-xs"
              >
                Confirm Reassignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
