'use client';

import React, { useEffect, useState } from 'react';

interface MapComponentProps {
  onSelectJurisdiction?: (district: string, taluk: string, village: string) => void;
  selectedVillage?: string;
}

const VILLAGES_DATA = [
  { name: 'Kaveri Village', taluk: 'Ambattur', district: 'Chennai', lat: 13.114, lng: 80.154, officer: 'Officer A (Tahsildar)', survey: '142/3B', patta: 'PT-10245', owner: 'K. Kumar', extent: '1.25 Acres', landType: 'Nanjai (Wetland)', villageCapacity: '28.75 Total Acres (12 Parcels)' },
  { name: 'East Village', taluk: 'Ambattur', district: 'Chennai', lat: 13.120, lng: 80.210, officer: 'Officer A (Tahsildar)', survey: '204/5', patta: 'PT-30112', owner: 'M. Anbazhagan', extent: '0.75 Acres', landType: 'Nanjai (Wetland)', villageCapacity: '19.40 Total Acres (8 Parcels)' },
  { name: 'West Village', taluk: 'Sriperumbudur', district: 'Kanchipuram', lat: 12.980, lng: 79.950, officer: 'Officer B (VAO)', survey: '12/4A', patta: 'PT-55019', owner: 'S. Priya', extent: '3.10 Acres', landType: 'Punjai (Dryland)', villageCapacity: '42.10 Total Acres (18 Parcels)' },
  { name: 'South Village', taluk: 'Sriperumbudur', district: 'Kanchipuram', lat: 12.930, lng: 79.980, officer: 'Officer B (VAO)', survey: '88/2', patta: 'PT-40301', owner: 'P. Ramesh', extent: '2.25 Acres', landType: 'Punjai (Dryland)', villageCapacity: '35.50 Total Acres (15 Parcels)' },
  { name: 'North Village', taluk: 'Ponneri', district: 'Tiruvallur', lat: 13.340, lng: 80.200, officer: 'Officer C (Sub-Registrar)', survey: '310/2C', patta: 'PT-99401', owner: 'V. Ramanathan', extent: '1.80 Acres', landType: 'Nanjai (Wetland)', villageCapacity: '22.80 Total Acres (10 Parcels)' },
];

export default function MapComponent({ onSelectJurisdiction, selectedVillage }: MapComponentProps) {
  const [activeVillage, setActiveVillage] = useState<string>(selectedVillage || 'Kaveri Village');
  const activeData = VILLAGES_DATA.find(v => v.name === activeVillage) || VILLAGES_DATA[0];

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
          <div style="font-family: sans-serif; padding: 6px; max-width: 220px;">
            <strong style="font-size: 14px; color: #1e3a8a;">${v.name}</strong><br/>
            <span style="font-size: 11px; color: #475569;">${v.taluk} Taluk | ${v.district}</span><br/>
            <div style="margin: 6px 0; background: #f8fafc; padding: 4px 6px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 11px; font-family: monospace;">
              <div>Extent: <strong>${v.extent}</strong></div>
              <div>Type: <strong>${v.landType}</strong></div>
              <div>Survey No: <strong>${v.survey}</strong></div>
              <div>Patta No: <strong>${v.patta}</strong></div>
            </div>
            <span style="font-size: 11px; color: #059669; font-weight: 600;">Officer: ${v.officer}</span><br/>
            <button id="btn-${v.name.replace(/\s+/g, '-')}" style="margin-top: 6px; width: 100%; background-color: #2563eb; color: white; border: none; padding: 5px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">
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
    <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-inner border border-slate-300">
      <div id="leaflet-map-container" className="w-full h-full" />
      
      {/* Overlay legend with rich land details */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200 text-xs max-w-xs space-y-2">
        <h5 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
          📍 Land Location & Extent Details
        </h5>
        <div className="space-y-1.5 text-[11px] text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Village:</span>
            <span className="font-bold text-blue-600">{activeData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Survey Parcel:</span>
            <span className="font-mono font-bold text-slate-800">{activeData.survey}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Patta Number:</span>
            <span className="font-mono font-bold text-slate-800">{activeData.patta}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Parcel Extent:</span>
            <span className="font-bold text-emerald-700">{activeData.extent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Land Classification:</span>
            <span className="font-bold text-slate-800">{activeData.landType}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-1.5">
            <span className="text-slate-500">Village Capacity:</span>
            <span className="font-bold text-amber-700">{activeData.villageCapacity}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-1 text-[10px]">
            <span className="text-slate-500">Assigned Officer:</span>
            <span className="font-bold text-slate-900">{activeData.officer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
