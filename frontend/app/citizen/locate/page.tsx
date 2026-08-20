'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Search, ShieldCheck, UserCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { locateLandAndJurisdiction, LandRecord, Jurisdiction } from '@/lib/api';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function LocateLandPage() {
  const [district, setDistrict] = useState<string>('Chennai');
  const [taluk, setTaluk] = useState<string>('Ambattur');
  const [village, setVillage] = useState<string>('Kaveri Village');

  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleSearch();
  }, [district, taluk, village]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await locateLandAndJurisdiction(district, taluk, village);
      setJurisdiction(data.jurisdiction);
      setRecords(data.land_records || []);
    } catch (err) {
      console.error("Locate error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapSelect = (d: string, t: string, v: string) => {
    setDistrict(d);
    setTaluk(t);
    setVillage(v);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4" /> Step 2: Jurisdiction Routing & Land Search
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Locate My Land</h1>
        <p className="text-sm text-slate-600">
          Select your land location using the interactive map or manual dropdown filters to determine the assigned jurisdiction officer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map & Selector Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Interactive Map Selection
            </h3>

            {/* Map */}
            <MapComponent onSelectJurisdiction={handleMapSelect} selectedVillage={village} />

            {/* Manual Dropdowns */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Manual Jurisdiction Selection (Fallback)</span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Kanchipuram">Kanchipuram</option>
                    <option value="Tiruvallur">Tiruvallur</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Taluk</label>
                  <select
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Ambattur">Ambattur</option>
                    <option value="Sriperumbudur">Sriperumbudur</option>
                    <option value="Ponneri">Ponneri</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Village</label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Kaveri Village">Kaveri Village</option>
                    <option value="East Village">East Village</option>
                    <option value="West Village">West Village</option>
                    <option value="South Village">South Village</option>
                    <option value="North Village">North Village</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Identified Jurisdiction & Reference Records */}
        <div className="space-y-4">
          {/* Officer Jurisdiction Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Assigned Jurisdiction Officer
            </h3>

            {jurisdiction ? (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="font-bold text-emerald-950 text-sm">
                  {jurisdiction.officer_name || 'Officer A (Tahsildar)'}
                </div>
                <div className="text-emerald-800 font-medium">
                  Designation: {jurisdiction.officer_designation || 'Tahsildar'}
                </div>
                <div className="text-slate-600 font-mono pt-1 border-t border-emerald-200/60">
                  {village} | {taluk} Taluk | {district}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                Searching jurisdiction mapping...
              </div>
            )}
          </div>

          {/* Reference Land Records Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Official Land Records (Reference)</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                {records.length} Found
              </span>
            </div>

            <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>Reference data source. Government database remains authoritative.</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {records.map((r) => (
                <div key={r.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start font-mono font-bold text-slate-900">
                    <span>Survey No: <span className="text-blue-700">{r.survey_number}</span></span>
                    <span className="text-slate-600">Patta: {r.patta_number}</span>
                  </div>
                  <div className="text-slate-700 font-medium">Owner: {r.owner_name} ({r.extent_acres} Acres)</div>

                  <Link
                    href={`/citizen/raise-grievance?land_id=${r.id}&patta=${r.patta_number}&survey=${r.survey_number}`}
                    className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-xs shadow-xs"
                  >
                    Raise Grievance for Survey {r.survey_number} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
