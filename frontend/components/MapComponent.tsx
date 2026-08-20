'use client';

import React, { useEffect, useState } from 'react';

interface MapComponentProps {
  onSelectJurisdiction?: (district: string, taluk: string, village: string) => void;
  selectedVillage?: string;
}

const VILLAGES_DATA = [
  { name: 'Kaveri Village', taluk: 'Ambattur', district: 'Chennai', lat: 13.114, lng: 80.154, officer: 'Officer A (Tahsildar)', survey: '142/3B' },
  { name: 'East Village', taluk: 'Ambattur', district: 'Chennai', lat: 13.120, lng: 80.210, officer: 'Officer A (Tahsildar)', survey: '204/5' },
  { name: 'West Village', taluk: 'Sriperumbudur', district: 'Kanchipuram', lat: 12.980, lng: 79.950, officer: 'Officer B (VAO)', survey: '12/4A' },
  { name: 'South Village', taluk: 'Sriperumbudur', district: 'Kanchipuram', lat: 12.930, lng: 79.980, officer: 'Officer B (VAO)', survey: '88/2' },
  { name: 'North Village', taluk: 'Ponneri', district: 'Tiruvallur', lat: 13.340, lng: 80.200, officer: 'Officer C (Sub-Registrar)', survey: '310/2C' },
];

export default function MapComponent({ onSelectJurisdiction, selectedVillage }: MapComponentProps) {
  const [activeVillage, setActiveVillage] = useState<string>(selectedVillage || 'Kaveri Village');

  useEffect(() => {
    if (selectedVillage) {
      setActiveVillage(selectedVillage);
    }
  }, [selectedVillage]);

  // Leaflet map dynamic loader
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mapInstance: any = null;
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    // Fix default marker icon issues in Leaflet with webpack
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const container = document.getElementById('leaflet-map-container');
    if (container && !(container as any)._leaflet_id) {
      mapInstance = L.map('leaflet-map-container').setView([13.0827, 80.1700], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      VILLAGES_DATA.forEach((v) => {
        const marker = L.marker([v.lat, v.lng]).addTo(mapInstance);
        
        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="font-size: 14px; color: #1e3a8a;">${v.name}</strong><br/>
            <span style="font-size: 12px; color: #475569;">Taluk: ${v.taluk} | District: ${v.district}</span><br/>
            <span style="font-size: 12px; color: #059669; font-weight: 600;">Officer: ${v.officer}</span><br/>
            <button id="btn-${v.name.replace(/\s+/g, '-')}" style="margin-top: 6px; background-color: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
              Select Jurisdiction
            </button>
          </div>
        `;
        
        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${v.name.replace(/\s+/g, '-')}`);
          if (btn) {
            btn.onclick = () => {
              setActiveVillage(v.name);
              if (onSelectJurisdiction) {
                onSelectJurisdiction(v.district, v.taluk, v.name);
              }
            };
          }
        });
      });
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [onSelectJurisdiction]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-slate-300">
      <div id="leaflet-map-container" className="w-full h-full" />
      
      {/* Overlay legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200 text-xs max-w-xs">
        <h5 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1">
          📍 Jurisdiction Mapper
        </h5>
        <p className="text-slate-600 mb-2">
          Click any village marker on the map to resolve assigned Tahsildar / Officer.
        </p>
        <div className="space-y-1 font-mono text-[11px] text-slate-700">
          <div className="flex justify-between">
            <span>Selected Village:</span>
            <span className="font-bold text-blue-600">{activeVillage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
