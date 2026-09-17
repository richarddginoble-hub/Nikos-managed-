import React, { useState, useMemo } from 'react';
import { TableCategory, SeatMapTable } from '../types';
import { 
  Sparkles, 
  Eye, 
  MapPin, 
  Users, 
  Check, 
  Info, 
  ShieldCheck, 
  Compass, 
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface InteractiveSeatMapProps {
  selectedTableCategory: TableCategory;
  onSelectCategory: (category: TableCategory) => void;
  selectedTableId: string | null;
  onSelectTableId: (tableId: string, table: SeatMapTable) => void;
  venueName: string;
}

// Generate realistic amphitheater seating layout for YTON The Music Show (Athens)
const GENERATED_TABLES: SeatMapTable[] = [
  // Tier 1: Diamond VIP Stage Front (Arc 1 - Distance 2.5m - 4.5m)
  { id: 'VIP-01', number: 1, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 260, y: 190, radius: 15, seats: 6, distanceFromStageMeters: 3.8, sightlinePercent: 98, sightlineDescription: 'Front Stage Left • Direct Bouzouki Solo Line', pricePerPerson: 180, minSpend: 720, status: 'available' },
  { id: 'VIP-02', number: 2, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 330, y: 220, radius: 16, seats: 6, distanceFromStageMeters: 3.1, sightlinePercent: 100, sightlineDescription: 'Center Left Front • Optimal Flower Throwing Arc', pricePerPerson: 180, minSpend: 720, status: 'available' },
  { id: 'VIP-03', number: 3, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 415, y: 235, radius: 17, seats: 8, distanceFromStageMeters: 2.6, sightlinePercent: 100, sightlineDescription: 'Dead Center Prime • Front-Row Nikos Vertis Eyeline', pricePerPerson: 180, minSpend: 720, status: 'selected' },
  { id: 'VIP-04', number: 4, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 500, y: 240, radius: 17, seats: 8, distanceFromStageMeters: 2.5, sightlinePercent: 100, sightlineDescription: 'Presidential Stage Front • Center Revolving Pivot', pricePerPerson: 180, minSpend: 720, status: 'available' },
  { id: 'VIP-05', number: 5, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 585, y: 235, radius: 17, seats: 8, distanceFromStageMeters: 2.6, sightlinePercent: 100, sightlineDescription: 'Dead Center Prime • Front-Row Nikos Vertis Eyeline', pricePerPerson: 180, minSpend: 720, status: 'available' },
  { id: 'VIP-06', number: 6, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 670, y: 220, radius: 16, seats: 6, distanceFromStageMeters: 3.1, sightlinePercent: 100, sightlineDescription: 'Center Right Front • Premium Stage Interaction', pricePerPerson: 180, minSpend: 720, status: 'reserved' },
  { id: 'VIP-07', number: 7, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 740, y: 190, radius: 15, seats: 6, distanceFromStageMeters: 3.8, sightlinePercent: 98, sightlineDescription: 'Front Stage Right • 25-Piece Orchestra Line', pricePerPerson: 180, minSpend: 720, status: 'available' },
  { id: 'VIP-08', number: 8, zoneId: 'stage-front-diamond', zoneName: 'Diamond VIP Stage Front', x: 805, y: 155, radius: 14, seats: 4, distanceFromStageMeters: 4.5, sightlinePercent: 95, sightlineDescription: 'Right Wing VIP • Private Sommelier Access', pricePerPerson: 180, minSpend: 720, status: 'reserved' },

  // Tier 2: Gold Ring Lounge (Arc 2 - Distance 7.5m - 12.0m)
  { id: 'GOLD-01', number: 1, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 190, y: 250, radius: 14, seats: 6, distanceFromStageMeters: 10.4, sightlinePercent: 92, sightlineDescription: 'Elevated Left Tier • Sweeping Stage Panorama', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-02', number: 2, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 255, y: 295, radius: 14, seats: 6, distanceFromStageMeters: 8.8, sightlinePercent: 95, sightlineDescription: 'Mid Left Ring • Balanced Acoustic Dispersion', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-03', number: 3, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 335, y: 325, radius: 15, seats: 6, distanceFromStageMeters: 8.0, sightlinePercent: 97, sightlineDescription: 'Inner Center Left • Direct Waterfall Vantage', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-04', number: 4, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 420, y: 340, radius: 15, seats: 6, distanceFromStageMeters: 7.7, sightlinePercent: 98, sightlineDescription: 'Center Gold 1st Row • Full Lighting Rig Center', pricePerPerson: 120, minSpend: 480, status: 'reserved' },
  { id: 'GOLD-05', number: 5, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 500, y: 345, radius: 15, seats: 6, distanceFromStageMeters: 7.5, sightlinePercent: 99, sightlineDescription: 'Center Gold 1st Row • Optimal Soundboard Mix', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-06', number: 6, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 580, y: 340, radius: 15, seats: 6, distanceFromStageMeters: 7.7, sightlinePercent: 98, sightlineDescription: 'Center Gold 1st Row • Full Lighting Rig Center', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-07', number: 7, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 665, y: 325, radius: 15, seats: 6, distanceFromStageMeters: 8.0, sightlinePercent: 97, sightlineDescription: 'Inner Center Right • Direct Waterfall Vantage', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-08', number: 8, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 745, y: 295, radius: 14, seats: 6, distanceFromStageMeters: 8.8, sightlinePercent: 95, sightlineDescription: 'Mid Right Ring • Balanced Acoustic Dispersion', pricePerPerson: 120, minSpend: 480, status: 'reserved' },
  { id: 'GOLD-09', number: 9, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 810, y: 250, radius: 14, seats: 6, distanceFromStageMeters: 10.4, sightlinePercent: 92, sightlineDescription: 'Elevated Right Tier • Sweeping Stage Panorama', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-10', number: 10, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 380, y: 385, radius: 14, seats: 4, distanceFromStageMeters: 11.2, sightlinePercent: 94, sightlineDescription: 'Gold Ring Row 2 • Intimate Horseshoe Booth', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-11', number: 11, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 500, y: 395, radius: 14, seats: 4, distanceFromStageMeters: 11.0, sightlinePercent: 96, sightlineDescription: 'Gold Ring Row 2 Center • Elevated Sightline', pricePerPerson: 120, minSpend: 480, status: 'available' },
  { id: 'GOLD-12', number: 12, zoneId: 'gold-ring-lounge', zoneName: 'Gold Ring Lounge', x: 620, y: 385, radius: 14, seats: 4, distanceFromStageMeters: 11.2, sightlinePercent: 94, sightlineDescription: 'Gold Ring Row 2 • Intimate Horseshoe Booth', pricePerPerson: 120, minSpend: 480, status: 'available' },

  // Tier 3: Silver Mezzanine (Arc 3 - Distance 15.0m - 22.0m)
  { id: 'SLV-01', number: 1, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 130, y: 310, radius: 13, seats: 6, distanceFromStageMeters: 18.5, sightlinePercent: 88, sightlineDescription: 'Terraced Mezzanine Left • Leather Sofa Seating', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-02', number: 2, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 185, y: 375, radius: 13, seats: 6, distanceFromStageMeters: 17.2, sightlinePercent: 89, sightlineDescription: 'Terraced Mezzanine Left • Leather Sofa Seating', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-03', number: 3, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 260, y: 430, radius: 13, seats: 6, distanceFromStageMeters: 16.5, sightlinePercent: 91, sightlineDescription: 'Mid Left Mezzanine • Wide Amphitheater View', pricePerPerson: 85, minSpend: 340, status: 'reserved' },
  { id: 'SLV-04', number: 4, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 345, y: 465, radius: 13, seats: 6, distanceFromStageMeters: 15.8, sightlinePercent: 92, sightlineDescription: 'Center Left Mezzanine • Clear Overhead Sound', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-05', number: 5, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 440, y: 485, radius: 14, seats: 6, distanceFromStageMeters: 15.2, sightlinePercent: 94, sightlineDescription: 'Center Mezzanine Prime • Full Laser Arena View', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-06', number: 6, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 560, y: 485, radius: 14, seats: 6, distanceFromStageMeters: 15.2, sightlinePercent: 94, sightlineDescription: 'Center Mezzanine Prime • Full Laser Arena View', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-07', number: 7, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 655, y: 465, radius: 13, seats: 6, distanceFromStageMeters: 15.8, sightlinePercent: 92, sightlineDescription: 'Center Right Mezzanine • Clear Overhead Sound', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-08', number: 8, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 740, y: 430, radius: 13, seats: 6, distanceFromStageMeters: 16.5, sightlinePercent: 91, sightlineDescription: 'Mid Right Mezzanine • Wide Amphitheater View', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-09', number: 9, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 815, y: 375, radius: 13, seats: 6, distanceFromStageMeters: 17.2, sightlinePercent: 89, sightlineDescription: 'Terraced Mezzanine Right • Leather Sofa Seating', pricePerPerson: 85, minSpend: 340, status: 'available' },
  { id: 'SLV-10', number: 10, zoneId: 'silver-mezzanine', zoneName: 'Silver Mezzanine Sofa Booth', x: 870, y: 310, radius: 13, seats: 6, distanceFromStageMeters: 18.5, sightlinePercent: 88, sightlineDescription: 'Terraced Mezzanine Right • Leather Sofa Seating', pricePerPerson: 85, minSpend: 340, status: 'reserved' },

  // Tier 4: Bronze Gallery & Cocktail High-Tops (Arc 4 - Distance 24.0m - 32.0m)
  { id: 'BRZ-01', number: 1, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 90, y: 410, radius: 11, seats: 2, distanceFromStageMeters: 28.0, sightlinePercent: 82, sightlineDescription: 'High-Top Cocktail Bar Left • Social Drink Ambiance', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-02', number: 2, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 170, y: 490, radius: 11, seats: 2, distanceFromStageMeters: 26.5, sightlinePercent: 84, sightlineDescription: 'High-Top Cocktail Bar Left • Swift Service Counter', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-03', number: 3, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 280, y: 550, radius: 11, seats: 2, distanceFromStageMeters: 24.5, sightlinePercent: 86, sightlineDescription: 'Rear Standing Promenade • Full Amphitheater Energy', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-04', number: 4, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 400, y: 580, radius: 11, seats: 2, distanceFromStageMeters: 23.5, sightlinePercent: 88, sightlineDescription: 'Main Bar Promenade Center • Elevated Bar Stools', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-05', number: 5, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 500, y: 590, radius: 11, seats: 2, distanceFromStageMeters: 23.0, sightlinePercent: 89, sightlineDescription: 'Main Bar Promenade Center • Direct Central Vista', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-06', number: 6, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 600, y: 580, radius: 11, seats: 2, distanceFromStageMeters: 23.5, sightlinePercent: 88, sightlineDescription: 'Main Bar Promenade Center • Elevated Bar Stools', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-07', number: 7, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 720, y: 550, radius: 11, seats: 2, distanceFromStageMeters: 24.5, sightlinePercent: 86, sightlineDescription: 'Rear Standing Promenade • Full Amphitheater Energy', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-08', number: 8, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 830, y: 490, radius: 11, seats: 2, distanceFromStageMeters: 26.5, sightlinePercent: 84, sightlineDescription: 'High-Top Cocktail Bar Right • Swift Service Counter', pricePerPerson: 35, minSpend: 35, status: 'available' },
  { id: 'BRZ-09', number: 9, zoneId: 'bar-standing-pass', zoneName: 'Bar Lounge & Standing Cocktail Ticket', x: 910, y: 410, radius: 11, seats: 2, distanceFromStageMeters: 28.0, sightlinePercent: 82, sightlineDescription: 'High-Top Cocktail Bar Right • Social Drink Ambiance', pricePerPerson: 35, minSpend: 35, status: 'available' }
];

export const InteractiveSeatMap: React.FC<InteractiveSeatMapProps> = ({
  selectedTableCategory,
  onSelectCategory,
  selectedTableId,
  onSelectTableId,
  venueName
}) => {
  const [hoveredTable, setHoveredTable] = useState<SeatMapTable | null>(null);
  const [zoneFilter, setZoneFilter] = useState<'all' | 'stage-front-diamond' | 'gold-ring-lounge' | 'silver-mezzanine' | 'bar-standing-pass'>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [showLaserSightlines, setShowLaserSightlines] = useState<boolean>(true);

  // Stage center coordinate in SVG viewBox (0 0 1000 660)
  const STAGE_CENTER = { x: 500, y: 90 };

  // Current active table (selected or hovered)
  const activeTable = useMemo(() => {
    if (hoveredTable) return hoveredTable;
    if (selectedTableId) {
      return GENERATED_TABLES.find(t => t.id === selectedTableId) || GENERATED_TABLES[2];
    }
    return GENERATED_TABLES[2]; // VIP-03 default
  }, [hoveredTable, selectedTableId]);

  // Filtered tables based on user filters
  const displayedTables = useMemo(() => {
    return GENERATED_TABLES.filter(t => {
      if (zoneFilter !== 'all' && t.zoneId !== zoneFilter) return false;
      if (onlyAvailable && t.status === 'reserved') return false;
      return true;
    });
  }, [zoneFilter, onlyAvailable]);

  // Color generator for zone
  const getZoneColors = (zoneId: string, isSelected: boolean, isHovered: boolean, isReserved: boolean) => {
    if (isReserved) {
      return {
        fill: '#1f2430',
        stroke: '#374151',
        text: '#64748b',
        glow: 'none'
      };
    }
    if (isSelected) {
      return {
        fill: '#f59e0b',
        stroke: '#ffffff',
        text: '#000000',
        glow: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.9))'
      };
    }
    if (isHovered) {
      return {
        fill: '#fbbf24',
        stroke: '#ffffff',
        text: '#000000',
        glow: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))'
      };
    }

    switch (zoneId) {
      case 'stage-front-diamond':
        return { fill: '#78350f', stroke: '#f59e0b', text: '#fef3c7', glow: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))' };
      case 'gold-ring-lounge':
        return { fill: '#713f12', stroke: '#eab308', text: '#fef08a', glow: 'none' };
      case 'silver-mezzanine':
        return { fill: '#1e293b', stroke: '#94a3b8', text: '#e2e8f0', glow: 'none' };
      case 'bar-standing-pass':
      default:
        return { fill: '#27272a', stroke: '#71717a', text: '#d4d4d8', glow: 'none' };
    }
  };

  const handleTableClick = (table: SeatMapTable) => {
    if (table.status === 'reserved') return;
    onSelectTableId(table.id, table);
  };

  return (
    <div className="bg-[#0b0d14] border border-[#232733] rounded-3xl p-4 sm:p-6 lg:p-7 relative overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#d4af37]/8 blur-[120px] pointer-events-none" />

      {/* Top Header & Map Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 relative z-10 border-b border-[#1c2130] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161c2b] border border-[#d4af37]/40 text-[11px] text-[#e5c158] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Interactive Amphitheater Blueprint</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300">Laser-Calibrated Sightlines</span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
            {venueName} — Precision Seating Arena
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Click on any available table to inspect direct laser distance from Nikos Vertis, unobstructed sightlines, and VIP beverage inclusions.
          </p>
        </div>

        {/* Controls: Zone filters and Sightline Toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowLaserSightlines(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showLaserSightlines
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-[#121622] text-stone-400 border-[#232733] hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Stage Sightline Beam: {showLaserSightlines ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setOnlyAvailable(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              onlyAvailable
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-[#121622] text-stone-400 border-[#232733] hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{onlyAvailable ? 'Showing: Available Only' : 'Show All Tables'}</span>
          </button>
        </div>
      </div>

      {/* Zone Legend & Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[11px] uppercase font-bold text-stone-400 mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#d4af37]" /> Filter Tier:
        </span>

        {[
          { id: 'all', label: 'All Arena Zones', count: GENERATED_TABLES.length, color: 'border-stone-600 text-stone-200' },
          { id: 'stage-front-diamond', label: 'Diamond VIP (<4.5m)', count: 8, color: 'border-amber-400 text-amber-300 bg-amber-500/10' },
          { id: 'gold-ring-lounge', label: 'Gold Ring (7-12m)', count: 12, color: 'border-yellow-500 text-yellow-300 bg-yellow-500/10' },
          { id: 'silver-mezzanine', label: 'Silver Mezzanine (15-22m)', count: 10, color: 'border-slate-400 text-slate-300 bg-slate-500/10' },
          { id: 'bar-standing-pass', label: 'Bronze Bar (23-30m)', count: 9, color: 'border-stone-500 text-stone-300 bg-stone-500/10' }
        ].map(zone => (
          <button
            key={zone.id}
            onClick={() => setZoneFilter(zone.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              zoneFilter === zone.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-extrabold border-[#d4af37] shadow-md shadow-[#d4af37]/20 scale-105'
                : `${zone.color} hover:border-stone-400`
            }`}
          >
            {zone.label} <span className="opacity-70 text-[10px]">({zone.count})</span>
          </button>
        ))}
      </div>

      {/* Interactive SVG Amphitheater Viewport */}
      <div className="relative bg-[#07090e] border border-[#1b202e] rounded-2xl p-2 sm:p-4 overflow-hidden">
        {/* Stage Atmosphere Lights Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-[#d4af37]/15 blur-[60px] pointer-events-none rounded-full" />

        <svg
          viewBox="0 0 1000 640"
          className="w-full h-auto select-none font-sans"
          style={{ minHeight: '360px' }}
        >
          <defs>
            {/* Stage Gold Radial Gradient */}
            <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#78350f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e180d" stopOpacity="1" />
            </radialGradient>

            {/* Waterfall backdrop pattern */}
            <linearGradient id="waterfallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>

            {/* Laser Line Gradient */}
            <linearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Amphitheater Arc Contour Guidelines */}
          <path d="M 120 180 A 420 420 0 0 0 880 180" fill="none" stroke="#1f293d" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          <path d="M 80 270 A 500 500 0 0 0 920 270" fill="none" stroke="#1f293d" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          <path d="M 40 370 A 580 580 0 0 0 960 370" fill="none" stroke="#1f293d" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />

          {/* 1. Waterfall & LED Visual Background Wall */}
          <rect x="250" y="8" width="500" height="38" rx="8" fill="url(#waterfallGrad)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
          <text x="500" y="24" fill="#7dd3fc" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="2">
            ≈ YTON CYBERNETIC WATERFALL & 4K LED RETRACTABLE WALL ≈
          </text>
          <text x="500" y="38" fill="#94a3b8" fontSize="9" textAnchor="middle">
            (Signature 15-meter waterfall curtain activated during "An Eisai Ena Asteri")
          </text>

          {/* 2. Main Revolving Stage Structure */}
          {/* Stage Outer Ring */}
          <circle cx={STAGE_CENTER.x} cy={STAGE_CENTER.y} r="72" fill="#131722" stroke="#d4af37" strokeWidth="3" opacity="0.9" />
          
          {/* Stage Center Revolving Platform */}
          <circle cx={STAGE_CENTER.x} cy={STAGE_CENTER.y} r="58" fill="url(#stageGlow)" stroke="#fef08a" strokeWidth="2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${STAGE_CENTER.x} ${STAGE_CENTER.y}`}
              to={`360 ${STAGE_CENTER.x} ${STAGE_CENTER.y}`}
              dur="60s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Center Stage Text & Performer Marker */}
          <circle cx={STAGE_CENTER.x} cy={STAGE_CENTER.y} r="8" fill="#ffffff" stroke="#e11d48" strokeWidth="3" />
          <text x={STAGE_CENTER.x} y={STAGE_CENTER.y - 14} fill="#000000" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="1">
            NIKOS VERTIS
          </text>
          <text x={STAGE_CENTER.x} y={STAGE_CENTER.y + 24} fill="#1a1405" fontSize="8" fontWeight="800" textAnchor="middle">
            ★ REVOLVING STAGE ★
          </text>
          <text x={STAGE_CENTER.x} y={STAGE_CENTER.y + 35} fill="#422006" fontSize="7" fontWeight="700" textAnchor="middle">
            25-PIECE BOUZOUKI ORCHESTRA
          </text>

          {/* 3. Stage Front Flower Throwing Pit Indicator */}
          <path
            d="M 320 160 Q 500 190 680 160"
            fill="none"
            stroke="#fb7185"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <text x="500" y="178" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">
            ❀ PRIMARY FLOWER TRAY THROWING ZONE (GARIFALLA) ❀
          </text>

          {/* 4. Active Sightline Laser Beam to Selected / Hovered Table */}
          {showLaserSightlines && activeTable && (
            <g className="transition-all duration-300">
              {/* Laser line from center stage to table */}
              <line
                x1={STAGE_CENTER.x}
                y1={STAGE_CENTER.y}
                x2={activeTable.x}
                y2={activeTable.y}
                stroke="url(#laserBeam)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.9"
              >
                <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
              </line>

              {/* Pulsing ring around target table */}
              <circle
                cx={activeTable.x}
                cy={activeTable.y}
                r={activeTable.radius + 8}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                opacity="0.8"
              >
                <animate attributeName="r" values={`${activeTable.radius + 4};${activeTable.radius + 14};${activeTable.radius + 4}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Laser Distance Floating Badge along the beam */}
              {(() => {
                const midX = (STAGE_CENTER.x + activeTable.x) / 2;
                const midY = (STAGE_CENTER.y + activeTable.y) / 2;
                return (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect x="-58" y="-14" width="116" height="26" rx="13" fill="#181c28" stroke="#f59e0b" strokeWidth="1.5" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.8))" />
                    <text x="0" y="3" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {activeTable.distanceFromStageMeters}m to Stage
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* 5. Render All Amphitheater Tables */}
          {displayedTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isHovered = hoveredTable?.id === table.id;
            const isReserved = table.status === 'reserved';
            const colors = getZoneColors(table.zoneId, isSelected, isHovered, isReserved);

            // Compute chair positions around the table
            const chairsCount = table.seats;
            const chairRadius = 3.5;
            const chairDistance = table.radius + 5;
            const chairs = Array.from({ length: chairsCount }).map((_, idx) => {
              const angle = (idx / chairsCount) * 2 * Math.PI;
              return {
                cx: table.x + Math.cos(angle) * chairDistance,
                cy: table.y + Math.sin(angle) * chairDistance
              };
            });

            return (
              <g
                key={table.id}
                onClick={() => handleTableClick(table)}
                onMouseEnter={() => setHoveredTable(table)}
                onMouseLeave={() => setHoveredTable(null)}
                className={`transition-transform duration-150 ${isReserved ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:scale-110'}`}
                style={{ transformOrigin: `${table.x}px ${table.y}px` }}
              >
                {/* Chairs around table */}
                {chairs.map((chair, cIdx) => (
                  <circle
                    key={`chair-${table.id}-${cIdx}`}
                    cx={chair.cx}
                    cy={chair.cy}
                    r={chairRadius}
                    fill={isReserved ? '#374151' : isSelected ? '#fbbf24' : '#475569'}
                    stroke="#0b0d14"
                    strokeWidth="1"
                  />
                ))}

                {/* Main Table Body */}
                <circle
                  cx={table.x}
                  cy={table.y}
                  r={table.radius}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ filter: colors.glow }}
                />

                {/* Table ID Label */}
                <text
                  x={table.x}
                  y={table.y + 3.5}
                  fill={colors.text}
                  fontSize={table.radius > 14 ? '9' : '8'}
                  fontWeight="900"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {table.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Legend inside SVG box */}
        <div className="absolute bottom-3 left-3 bg-[#11141e]/90 backdrop-blur-md border border-[#232733] px-3 py-2 rounded-xl text-[11px] flex items-center gap-3 text-stone-300 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30" />
            <span>Diamond VIP (&lt;4.5m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span>Gold Ring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Silver Mezzanine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-600" />
            <span className="text-stone-500">Reserved</span>
          </div>
        </div>
      </div>

      {/* Selected Table In-Depth Inspector Card */}
      {activeTable && (
        <div className="mt-6 bg-[#121622] border-2 border-[#d4af37]/60 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          {/* Subtle gold spotlight */}
          <div className="absolute top-0 right-0 w-64 h-32 bg-[#d4af37]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Column 1: Table ID & Zone info */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#232733] pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37] text-black font-black text-xs">
                  TABLE {activeTable.id}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTable.status === 'reserved' 
                    ? 'bg-rose-500/20 text-rose-300' 
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {activeTable.status === 'reserved' ? 'Reserved' : 'Available for Tonight'}
                </span>
              </div>
              <h4 className="font-display font-extrabold text-white text-lg">
                {activeTable.zoneName}
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                {activeTable.sightlineDescription}
              </p>
            </div>

            {/* Column 2: Exact Metrics (Distance from stage, Sightline, Guests) */}
            <div className="md:col-span-5 grid grid-cols-3 gap-3 text-center border-b md:border-b-0 md:border-r border-[#232733] pb-4 md:pb-0 md:pr-4">
              {/* Distance metric */}
              <div className="bg-[#0b0d14] border border-[#232733] rounded-xl p-2.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                  Stage Distance
                </span>
                <span className="text-base font-black font-mono text-[#fef08a] flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  {activeTable.distanceFromStageMeters}m
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Laser Verified</span>
              </div>

              {/* Sightline metric */}
              <div className="bg-[#0b0d14] border border-[#232733] rounded-xl p-2.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                  Sightline Score
                </span>
                <span className="text-base font-black font-mono text-white flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                  {activeTable.sightlinePercent}%
                </span>
                <span className="text-[10px] text-[#38bdf8] font-medium">Unobstructed</span>
              </div>

              {/* Capacity metric */}
              <div className="bg-[#0b0d14] border border-[#232733] rounded-xl p-2.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                  Table Capacity
                </span>
                <span className="text-base font-black font-mono text-white flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  {activeTable.seats}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">Guests</span>
              </div>
            </div>

            {/* Column 3: Price & Immediate Table Selection Action */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-stone-400">Min Spend:</span>
                <span className="text-lg font-black font-mono text-[#e5c158]">
                  €{activeTable.minSpend}
                </span>
              </div>

              <button
                onClick={() => {
                  if (activeTable.status !== 'reserved') {
                    onSelectTableId(activeTable.id, activeTable);
                  }
                }}
                disabled={activeTable.status === 'reserved'}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedTableId === activeTable.id
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-300'
                    : activeTable.status === 'reserved'
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-black hover:brightness-110 shadow-lg shadow-[#d4af37]/20'
                }`}
              >
                {selectedTableId === activeTable.id ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Table {activeTable.id} Confirmed</span>
                  </>
                ) : activeTable.status === 'reserved' ? (
                  <span>Table Currently Reserved</span>
                ) : (
                  <>
                    <span>Confirm Table {activeTable.id}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
