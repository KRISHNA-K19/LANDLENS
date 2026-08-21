'use client';

import React from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs">
      <Globe className="w-3.5 h-3.5 text-blue-400 ml-1 mr-0.5 shrink-0" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 rounded font-bold transition ${
          language === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('ta')}
        className={`px-2 py-0.5 rounded font-bold transition ${
          language === 'ta' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2 py-0.5 rounded font-bold transition ${
          language === 'hi' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
