'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function CitizenNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Grievance GL-1024 Registered",
      message: "Your grievance GL-1024 has been registered and routed to Ambattur Tahsildar (Officer A).",
      timestamp: "2 hours ago",
      is_read: false,
      case_code: "GL-1024"
    },
    {
      id: 2,
      title: "AI Analysis Completed",
      message: "Gemini AI completed document extraction for GL-1024. Potential Survey Number discrepancy flagged.",
      timestamp: "1 hour ago",
      is_read: false,
      case_code: "GL-1024"
    },
    {
      id: 3,
      title: "Additional Documents Requested",
      message: "Officer A requested additional title verification documents for case GL-1024.",
      timestamp: "30 mins ago",
      is_read: false,
      case_code: "GL-1024"
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" /> Notifications & Case Updates
          </h1>
          <p className="text-xs text-slate-600">Real-time alerts on your submitted land grievances.</p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
              n.is_read ? 'bg-white border-slate-200' : 'bg-blue-50/60 border-blue-200 shadow-sm'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                {!n.is_read && (
                  <span className="bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              <span className="text-[10px] text-slate-400 font-mono block pt-1">{n.timestamp}</span>
            </div>

            <Link
              href={`/citizen/case/${n.case_code}`}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              View Case <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
