'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Edit2, ShieldCheck, CheckCircle2, UserX } from 'lucide-react';

export default function AdminOfficersPage() {
  const [officers, setOfficers] = useState([
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
      jurisdiction: "Kanchipuram (Sriperumbudur)",
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
      jurisdiction: "Tiruvallur (Ponneri)",
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
  const [newJur, setNewJur] = useState<string>('Chennai (Ambattur)');

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;
    const newOff = {
      id: officers.length + 1,
      name: newName,
      code: newCode,
      designation: newDesig,
      jurisdiction: newJur,
      assigned_cases: 0,
      pending: 0,
      sla_at_risk: 0,
      status: "ACTIVE"
    };
    setOfficers([...officers, newOff]);
    setShowAddModal(false);
    setNewName('');
    setNewCode('');
  };

  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-700" /> Revenue Officers Directory
          </h1>
          <p className="text-xs text-slate-600">Manage revenue officer credentials, designations, and assigned administrative jurisdictions.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Revenue Officer
        </button>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">OFFICER</th>
              <th className="p-4">EMPLOYEE CODE</th>
              <th className="p-4">JURISDICTION</th>
              <th className="p-4">ASSIGNED CASES</th>
              <th className="p-4">SLA AT RISK</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {officers.map((off) => (
              <tr key={off.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-900">
                  <div>{off.name}</div>
                  <div className="text-[11px] text-slate-400 font-normal">{off.designation}</div>
                </td>
                <td className="p-4 font-mono font-bold text-purple-700">{off.code}</td>
                <td className="p-4 text-slate-700">{off.jurisdiction}</td>
                <td className="p-4 font-mono font-bold text-slate-900">{off.assigned_cases} ({off.pending} pending)</td>
                <td className="p-4 font-mono font-bold text-emerald-600">{off.sla_at_risk}</td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {off.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button className="p-1.5 text-slate-500 hover:text-blue-600 transition" title="Edit Officer">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Officer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddOfficer} className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Add New Revenue Officer</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Officer Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Officer D"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
                <select
                  value={newDesig}
                  onChange={(e) => setNewDesig(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="Tahsildar">Tahsildar</option>
                  <option value="VAO">VAO</option>
                  <option value="Sub-Registrar">Sub-Registrar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jurisdiction</label>
                <select
                  value={newJur}
                  onChange={(e) => setNewJur(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="Chennai (Ambattur)">Chennai (Ambattur)</option>
                  <option value="Kanchipuram (Sriperumbudur)">Kanchipuram (Sriperumbudur)</option>
                  <option value="Tiruvallur (Ponneri)">Tiruvallur (Ponneri)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-700 text-white font-bold rounded-xl text-xs"
              >
                Save Officer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
