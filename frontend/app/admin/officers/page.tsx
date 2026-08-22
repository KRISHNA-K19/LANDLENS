'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Edit2, ShieldCheck, CheckCircle2, UserX, MapPin, Building2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface OfficerItem {
  id: number;
  name: string;
  code: string;
  designation: string;
  jurisdiction: string;
  assigned_cases: number;
  pending: number;
  sla_at_risk: number;
  status: string;
}

export default function AdminOfficersPage() {
  const [officers, setOfficers] = useState<OfficerItem[]>([
    {
      id: 1,
      name: "Officer A",
      code: "REV-AMB-01",
      designation: "Tahsildar",
      jurisdiction: "Chennai (Ambattur - Kaveri Village)",
      assigned_cases: 5,
      pending: 2,
      sla_at_risk: 0,
      status: "ACTIVE"
    },
    {
      id: 2,
      name: "Officer B",
      code: "REV-SRP-02",
      designation: "VAO",
      jurisdiction: "Kanchipuram (Sriperumbudur - West Village)",
      assigned_cases: 3,
      pending: 1,
      sla_at_risk: 0,
      status: "ACTIVE"
    },
    {
      id: 3,
      name: "Officer C",
      code: "REG-PON-03",
      designation: "Sub-Registrar",
      jurisdiction: "Tiruvallur (Ponneri - North Village)",
      assigned_cases: 4,
      pending: 2,
      sla_at_risk: 0,
      status: "ACTIVE"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');
  const [newDesig, setNewDesig] = useState<string>('Tahsildar');
  const [district, setDistrict] = useState<string>('Chennai');
  const [taluk, setTaluk] = useState<string>('Ambattur');
  const [village, setVillage] = useState<string>('Kaveri Village');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Load local stored officers if present
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('landlens_admin_officers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) setOfficers(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      alert("Please provide officer name and employee code.");
      return;
    }
    setSubmitting(true);

    const jurisdictionText = `${district} (${taluk} - ${village})`;

    const newOff: OfficerItem = {
      id: Date.now(),
      name: newName,
      code: newCode.toUpperCase(),
      designation: newDesig,
      jurisdiction: jurisdictionText,
      assigned_cases: 0,
      pending: 0,
      sla_at_risk: 0,
      status: "ACTIVE"
    };

    try {
      await apiClient.post('/admin/officers', null, {
        params: {
          name: newName,
          employee_code: newCode.toUpperCase(),
          designation: newDesig,
          district: district,
          taluk: taluk,
          village: village
        }
      });
    } catch (err) {
      console.warn("Backend API not reachable, relying on persistent state layer");
    }

    const updatedList = [newOff, ...officers];
    setOfficers(updatedList);

    if (typeof window !== 'undefined') {
      localStorage.setItem('landlens_admin_officers', JSON.stringify(updatedList));

      // Update jurisdiction mappings in local storage for /admin/jurisdictions sync
      const savedJur = localStorage.getItem('landlens_admin_jurisdictions');
      let jurList = savedJur ? JSON.parse(savedJur) : [];
      jurList = [
        {
          id: Date.now(),
          district,
          taluk,
          village,
          officer: `${newName} (${newDesig})`
        },
        ...jurList
      ];
      localStorage.setItem('landlens_admin_jurisdictions', JSON.stringify(jurList));
    }

    setShowAddModal(false);
    setNewName('');
    setNewCode('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-700" /> Revenue Officers & Jurisdiction Directory
          </h1>
          <p className="text-xs text-slate-600">
            Create revenue officers and provision their designated District ➔ Taluk ➔ Village jurisdiction mappings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Officer & Jurisdiction
        </button>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">OFFICER NAME & ROLE</th>
              <th className="p-4">EMPLOYEE CODE</th>
              <th className="p-4">ASSIGNED JURISDICTION</th>
              <th className="p-4">ASSIGNED CASES</th>
              <th className="p-4">SLA BREACH RISK</th>
              <th className="p-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {officers.map((off) => (
              <tr key={off.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-900">
                  <div>{off.name}</div>
                  <div className="text-[11px] text-purple-700 font-medium">{off.designation}</div>
                </td>
                <td className="p-4 font-mono font-bold text-slate-800">{off.code}</td>
                <td className="p-4 text-slate-700 font-medium">{off.jurisdiction}</td>
                <td className="p-4 font-mono font-bold text-slate-900">{off.assigned_cases} ({off.pending} pending)</td>
                <td className="p-4 font-mono font-bold text-emerald-600">{off.sla_at_risk}</td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {off.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* ADD OFFICER & JURISDICTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddOfficer} className="bg-white max-w-lg w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-700" /> Add Revenue Officer & Jurisdiction
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Officer Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Officer Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Officer D (R. Selvam)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Employee Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. REV-CHN-04"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Official Designation</label>
              <select
                value={newDesig}
                onChange={(e) => setNewDesig(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="Tahsildar">Tahsildar (Revenue Authority)</option>
                <option value="VAO">Village Administrative Officer (VAO)</option>
                <option value="Sub-Registrar">Sub-Registrar (Registration Dept)</option>
                <option value="Revenue Inspector">Revenue Inspector (RI)</option>
              </select>
            </div>

            {/* Administrative Jurisdiction Selection */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                <MapPin className="w-4 h-4 text-purple-700" /> Designated Administrative Jurisdiction
              </span>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Kanchipuram">Kanchipuram</option>
                    <option value="Tiruvallur">Tiruvallur</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Taluk</label>
                  <select
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Ambattur">Ambattur</option>
                    <option value="Sriperumbudur">Sriperumbudur</option>
                    <option value="Ponneri">Ponneri</option>
                    <option value="Egmore">Egmore</option>
                    <option value="Tambaram">Tambaram</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Village / Area</label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Kaveri Village">Kaveri Village</option>
                    <option value="East Village">East Village</option>
                    <option value="West Village">West Village</option>
                    <option value="South Village">South Village</option>
                    <option value="North Village">North Village</option>
                    <option value="Adyar Village">Adyar Village</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                {submitting ? 'Creating Officer...' : 'Save Officer & Assign Jurisdiction'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
