'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Search, ShieldCheck, AlertCircle, ArrowRight, FileText } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function MyLandPage() {
  const [district, setDistrict] = useState<string>('Chennai');
  const [taluk, setTaluk] = useState<string>('Ambattur');
  const [village, setVillage] = useState<string>('Kaveri Village');

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
          <MapPin className="w-4 h-4" /> My Land Reference Portal
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Locate & Reference My Land</h1>
        <p className="text-sm text-slate-600">
          Identify your land location using the interactive map or manual dropdown filters to inspect reference records and revenue officer mappings.
        </p>
      </div>

      {/* Prominent Legal Disclaimer Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-amber-800 block mb-0.5">Location Assistance Notice</span>
          <p>
            Location assistance only — legal ownership and cadastral boundaries must be verified through authorized government records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map & Selector Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Map Location Selection
            </h3>

            {/* Interactive Map */}
            <MapComponent onSelectJurisdiction={handleMapSelect} selectedVillage={village} />

            {/* Manual Location Selection */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Manual Location Selection</span>
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

        {/* Reference Land Parcel Detail Card */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Reference Land Parcel Record
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="text-slate-500 font-sans font-bold text-[11px]">Selected Village: {village}</div>
              <div className="text-slate-800">Patta Number: <span className="font-bold text-blue-600">PT-10245</span></div>
              <div className="text-slate-800">Survey Number: <span className="font-bold text-emerald-600">142/3B</span></div>
              <div className="text-slate-800">Owner Stated: K. Kumar</div>
              <div className="text-slate-800">Extent: 1.25 Acres (Nanjai Wetland)</div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/citizen/land/1"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                Inspect Complete Reference Record <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/citizen/grievances/new"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                Report an Issue with This Record →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
